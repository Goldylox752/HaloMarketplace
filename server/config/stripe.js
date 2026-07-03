// ==========================================
// HALO MARKETPLACE
// Stripe Configuration
// config/stripe.js
// ==========================================

require("dotenv").config();

const Stripe = require("stripe");

// ==========================================
// ENVIRONMENT VARIABLES
// ==========================================

const secretKey = process.env.STRIPE_SECRET_KEY;

if (!secretKey) {

    throw new Error(
        "❌ STRIPE_SECRET_KEY is missing from your .env file."
    );

}

// ==========================================
// STRIPE CLIENT
// ==========================================

const stripe = new Stripe(secretKey, {

    apiVersion: "2025-06-30.basil",

    appInfo: {

        name: "Halo Marketplace",

        version: "1.0.0"

    },

    maxNetworkRetries: 2,

    timeout: 30000

});

// ==========================================
// HELPER FUNCTIONS
// ==========================================

const formatAmount = (amount) => {

    return Math.round(Number(amount) * 100);

};

const formatCurrency = (amount) => {

    return (amount / 100).toFixed(2);

};

// ==========================================
// EXPORTS
// ==========================================

module.exports = {

    stripe,

    formatAmount,

    formatCurrency

};
