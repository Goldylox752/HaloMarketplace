// ==========================================
// models/Category.js
// Halo Marketplace Category Model
// ==========================================

const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        maxlength: 50
    },

    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },

    description: {
        type: String,
        default: ""
    },

    image: {
        type: String,
        default: ""
    },

    icon: {
        type: String,
        default: ""
    },

    parentCategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        default: null
    },

    featured: {
        type: Boolean,
        default: false
    },

    sortOrder: {
        type: Number,
        default: 0
    },

    productCount: {
        type: Number,
        default: 0
    },

    isActive: {
        type: Boolean,
        default: true
    }

}, {
    timestamps: true
});

// ==========================================
// Indexes
// ==========================================

categorySchema.index({
    name: 1
});

categorySchema.index({
    slug: 1
});

categorySchema.index({
    featured: 1
});

categorySchema.index({
    parentCategory: 1
});

// ==========================================
// Export
// ==========================================

module.exports = mongoose.model("Category", categorySchema);
