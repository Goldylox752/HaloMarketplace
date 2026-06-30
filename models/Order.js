const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
{
    buyer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    listing: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Listing",
        required: true
    },

    quantity: {
        type: Number,
        required: true,
        default: 1,
        min: 1
    },

    price: {
        type: Number,
        required: true
    },

    subtotal: {
        type: Number,
        required: true
    },

    tax: {
        type: Number,
        default: 0
    },

    shippingCost: {
        type: Number,
        default: 0
    },

    total: {
        type: Number,
        required: true
    },

    currency: {
        type: String,
        default: "cad"
    },

    paymentMethod: {
        type: String,
        default: "stripe"
    },

    paymentStatus: {
        type: String,
        enum: [
            "pending",
            "paid",
            "failed",
            "refunded"
        ],
        default: "pending"
    },

    orderStatus: {
        type: String,
        enum: [
            "pending",
            "processing",
            "shipped",
            "delivered",
            "cancelled"
        ],
        default: "pending"
    },

    stripeSessionId: {
        type: String
    },

    stripePaymentIntentId: {
        type: String
    },

    shippingAddress: {
        fullName: String,
        address1: String,
        address2: String,
        city: String,
        province: String,
        postalCode: String,
        country: String,
        phone: String
    },

    trackingNumber: {
        type: String
    },

    notes: {
        type: String
    }

},
{
    timestamps: true
});

module.exports = mongoose.model("Order", orderSchema);
