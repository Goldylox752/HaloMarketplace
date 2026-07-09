// ==========================================
// Halo Marketplace
// Stripe Webhook Routes
// File: server/routes/webhookRoutes.js
// ==========================================

require("dotenv").config();

const express = require("express");
const Stripe = require("stripe");

const router = express.Router();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2025-06-30.basil"
});

// IMPORTANT:
// In your main server file use:
//
// app.use(
//   "/api/webhooks/stripe",
//   express.raw({ type: "application/json" }),
//   webhookRoutes
// );
//
// Do NOT use express.json() before this route.
//

router.post("/", async (req, res) => {

    const signature = req.headers["stripe-signature"];

    let event;

    try {

        event = stripe.webhooks.constructEvent(
            req.body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET
        );

    } catch (err) {

        console.error("❌ Stripe Signature Error");
        console.error(err.message);

        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    try {

        switch (event.type) {

            // ==========================
            // CHECKOUT
            // ==========================

            case "checkout.session.completed": {

                const session = event.data.object;

                console.log("✅ Checkout Complete");
                console.log(session.id);

                // TODO:
                // Update order
                // Reduce inventory
                // Create transaction
                // Email customer
                // Notify seller

                break;
            }

            case "checkout.session.async_payment_succeeded": {

                console.log("Async Payment Success");

                break;
            }

            case "checkout.session.async_payment_failed": {

                console.log("Async Payment Failed");

                break;
            }

            // ==========================
            // PAYMENT INTENTS
            // ==========================

            case "payment_intent.succeeded": {

                const payment = event.data.object;

                console.log("Payment Succeeded");

                console.log(payment.id);

                break;
            }

            case "payment_intent.payment_failed": {

                console.log("Payment Failed");

                break;
            }

            case "payment_intent.canceled": {

                console.log("Payment Cancelled");

                break;
            }

            // ==========================
            // SUBSCRIPTIONS
            // ==========================

            case "customer.subscription.created": {

                console.log("Subscription Created");

                break;
            }

            case "customer.subscription.updated": {

                console.log("Subscription Updated");

                break;
            }

            case "customer.subscription.deleted": {

                console.log("Subscription Deleted");

                break;
            }

            // ==========================
            // INVOICES
            // ==========================

            case "invoice.paid": {

                console.log("Invoice Paid");

                break;
            }

            case "invoice.payment_failed": {

                console.log("Invoice Failed");

                break;
            }

            case "invoice.finalized": {

                console.log("Invoice Finalized");

                break;
            }

            // ==========================
            // REFUNDS
            // ==========================

            case "charge.refunded": {

                console.log("Refund Issued");

                break;
            }

            case "charge.dispute.created": {

                console.log("Charge Dispute");

                break;
            }

            // ==========================
            // UNKNOWN EVENT
            // ==========================

            default:

                console.log(`Unhandled Event: ${event.type}`);
        }

        return res.json({
            received: true
        });

    } catch (err) {

        console.error(err);

        return res.status(500).json({
            success: false,
            message: err.message
        });

    }

});

module.exports = router;
