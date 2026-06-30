const stripe = require("../config/stripe");
const Order = require("../models/Order");
const Listing = require("../models/Listing");

/**
 * Create Stripe Checkout Session
 */
exports.createCheckoutSession = async (req, res) => {
    try {
        const { orderId } = req.body;

        if (!orderId) {
            return res.status(400).json({
                success: false,
                message: "Order ID is required."
            });
        }

        const order = await Order.findById(orderId)
            .populate("listing")
            .populate("buyer", "email name");

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found."
            });
        }

        // Verify buyer
        if (order.buyer._id.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to pay for this order."
            });
        }

        // Prevent duplicate payment
        if (order.paymentStatus === "paid") {
            return res.status(400).json({
                success: false,
                message: "This order has already been paid."
            });
        }

        const listing = order.listing;

        if (!listing) {
            return res.status(404).json({
                success: false,
                message: "Listing no longer exists."
            });
        }

        // Verify inventory
        if (listing.quantity < order.quantity) {
            return res.status(400).json({
                success: false,
                message: "Insufficient inventory."
            });
        }

        const session = await stripe.checkout.sessions.create({
            mode: "payment",

            payment_method_types: ["card"],

            customer_email: order.buyer.email,

            line_items: [
                {
                    quantity: order.quantity,

                    price_data: {
                        currency: order.currency || "cad",

                        product_data: {
                            name: listing.title,
                            description: listing.description,
                            images: listing.images || []
                        },

                        unit_amount: Math.round(order.price * 100)
                    }
                }
            ],

            metadata: {
                orderId: order._id.toString(),
                listingId: listing._id.toString(),
                buyerId: order.buyer._id.toString(),
                sellerId: order.seller.toString()
            },

            success_url: `${process.env.CLIENT_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,

            cancel_url: `${process.env.CLIENT_URL}/checkout/cancel`
        });

        order.stripeSessionId = session.id;

        await order.save();

        return res.status(200).json({
            success: true,
            sessionId: session.id,
            checkoutUrl: session.url
        });

    } catch (error) {

        console.error("Stripe Checkout Error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to create checkout session.",
            error:
                process.env.NODE_ENV === "development"
                    ? error.message
                    : undefined
        });
    }
};
