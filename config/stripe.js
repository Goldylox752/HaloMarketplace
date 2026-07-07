// ========================================
// Halo Marketplace
// Stripe Configuration
// config/stripe.js
// ========================================

require("dotenv").config();

const Stripe = require("stripe");


// ========================================
// Validate Key
// ========================================

if (!process.env.STRIPE_SECRET_KEY) {

    console.warn(
        "⚠️ STRIPE_SECRET_KEY is missing"
    );

}


// ========================================
// Stripe Client
// ========================================

const stripe = new Stripe(
    process.env.STRIPE_SECRET_KEY,
    {
        apiVersion: "2025-06-30.basil"
    }
);


// ========================================
// Export
// ========================================

module.exports = stripe;