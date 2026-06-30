const stripe = require("../config/stripe");

const Order = require("../models/Order");
const Listing = require("../models/Listing");

/**
 * Stripe Webhook
 */

exports.stripeWebhook = async (req, res) => {

    const signature = req.headers["stripe-signature"];

    let event;

    try {

        event = stripe.webhooks.constructEvent(
            req.body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET
        );

    } catch (err) {

        console.error("Webhook Signature Error:", err.message);

        return res.status(400).send(`Webhook Error: ${err.message}`);

    }

    switch (event.type) {

        case "checkout.session.completed":

            try {

                const session = event.data.object;

                const order = await Order.findById(
                    session.metadata.orderId
                );

                if (!order) {
                    return res.status(404).end();
                }

                // Prevent duplicate webhook processing
                if (order.paymentStatus === "paid") {
                    return res.status(200).json({
                        received: true
                    });
                }

                const listing = await Listing.findById(order.listing);

                if (!listing) {
                    return res.status(404).end();
                }

                // Reduce inventory
                listing.quantity -= order.quantity;

                if (listing.quantity < 0) {
                    listing.quantity = 0;
                }

                await listing.save();

                order.paymentStatus = "paid";
                order.orderStatus = "processing";

                order.stripeSessionId = session.id;

                order.stripePaymentIntentId =
                    session.payment_intent;

                await order.save();

                console.log(
                    `Payment received for Order ${order._id}`
                );

            } catch (err) {

                console.error(err);

            }

            break;

        case "checkout.session.expired":

            console.log("Checkout session expired.");

            break;

        case "payment_intent.payment_failed":

            console.log("Payment failed.");

            break;

        default:

            console.log(`Unhandled Event: ${event.type}`);

    }

    res.status(200).json({
        received: true
    });

};
