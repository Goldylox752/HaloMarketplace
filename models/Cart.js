// ==========================================
// models/Cart.js
// Halo Marketplace Cart Model
// ==========================================

const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema({

    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
    },

    vendor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
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

    title: {
        type: String,
        required: true
    },

    image: {
        type: String,
        default: ""
    }

}, { _id: false });

const cartSchema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true
    },

    items: [cartItemSchema],

    subtotal: {
        type: Number,
        default: 0
    },

    tax: {
        type: Number,
        default: 0
    },

    shipping: {
        type: Number,
        default: 0
    },

    discount: {
        type: Number,
        default: 0
    },

    total: {
        type: Number,
        default: 0
    }

}, {
    timestamps: true
});

// ==========================================
// Calculate Cart Totals
// ==========================================

cartSchema.methods.calculateTotals = function () {

    this.subtotal = this.items.reduce((total, item) => {
        return total + (item.price * item.quantity);
    }, 0);

    this.total =
        this.subtotal +
        this.tax +
        this.shipping -
        this.discount;
};

// ==========================================
// Export
// ==========================================

module.exports = mongoose.model("Cart", cartSchema);
