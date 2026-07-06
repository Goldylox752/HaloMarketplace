// =============================================
// Halo Marketplace
// server/models/Conversation.js
// Part 1 of 2
// =============================================

"use strict";

const mongoose = require("mongoose");

const { Schema } = mongoose;

// =============================================
// Conversation Schema
// =============================================

const conversationSchema = new Schema(
    {
        // Participants
        buyer: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true
        },

        vendor: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true
        },

        participants: [
            {
                type: Schema.Types.ObjectId,
                ref: "User"
            }
        ],

        // Optional Product
        product: {
            type: Schema.Types.ObjectId,
            ref: "Product",
            default: null,
            index: true
        },

        // Optional Order
        order: {
            type: Schema.Types.ObjectId,
            ref: "Order",
            default: null,
            index: true
        },

        // Status
        status: {
            type: String,
            enum: [
                "active",
                "archived",
                "blocked",
                "closed"
            ],
            default: "active",
            index: true
        },

        // Last Message
        lastMessage: {
            type: String,
            default: "",
            maxlength: 500
        },

        lastMessageAt: {
            type: Date,
            default: Date.now,
            index: true
        },

        lastMessageBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
            default: null
        },

        // Unread Counters
        unreadBuyer: {
            type: Number,
            default: 0,
            min: 0
        },

        unreadVendor: {
            type: Number,
            default: 0,
            min: 0
        },

        // Soft Delete
        deletedForBuyer: {
            type: Boolean,
            default: false
        },

        deletedForVendor: {
            type: Boolean,
            default: false
        },

        // Misc
        isLocked: {
            type: Boolean,
            default: false
        },

        metadata: {
            type: Schema.Types.Mixed,
            default: {}
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

// =============================================
// Indexes
// =============================================

conversationSchema.index({
    buyer: 1,
    vendor: 1
});

conversationSchema.index({
    participants: 1
});

conversationSchema.index({
    lastMessageAt: -1
});

conversationSchema.index({
    product: 1,
    status: 1
});

conversationSchema.index({
    order: 1
});

// =============================================
// Virtuals
// =============================================

conversationSchema.virtual("hasUnread").get(function () {
    return (
        this.unreadBuyer > 0 ||
        this.unreadVendor > 0
    );
});

conversationSchema.virtual("participantCount").get(function () {
    return this.participants.length;
});

// =============================================
// Pre Save Middleware
// =============================================

conversationSchema.pre("save", function (next) {

    if (!this.participants.length) {

        this.participants = [
            this.buyer,
            this.vendor
        ];

    }

    next();

});

// =============================================
// Halo Marketplace
// server/models/Conversation.js
// Part 2 of 2
// =============================================

// =============================================
// Instance Methods
// =============================================

conversationSchema.methods.markBuyerRead = async function () {
    this.unreadBuyer = 0;
    return this.save();
};

conversationSchema.methods.markVendorRead = async function () {
    this.unreadVendor = 0;
    return this.save();
};

conversationSchema.methods.archive = async function () {
    this.status = "archived";
    return this.save();
};

conversationSchema.methods.activate = async function () {
    this.status = "active";
    return this.save();
};

conversationSchema.methods.close = async function () {
    this.status = "closed";
    return this.save();
};

conversationSchema.methods.block = async function () {
    this.status = "blocked";
    this.isLocked = true;
    return this.save();
};

conversationSchema.methods.unlock = async function () {
    this.isLocked = false;

    if (this.status === "blocked") {
        this.status = "active";
    }

    return this.save();
};

conversationSchema.methods.updateLastMessage = async function (
    message,
    senderId
) {

    this.lastMessage = String(message).substring(0, 500);
    this.lastMessageAt = new Date();
    this.lastMessageBy = senderId;

    return this.save();

};

// =============================================
// Static Methods
// =============================================

conversationSchema.statics.findByUser = function (userId) {

    return this.find({
        participants: userId,
        status: { $ne: "closed" }
    })
        .populate("buyer", "username avatar")
        .populate("vendor", "username avatar")
        .populate("product", "title images price")
        .sort({
            lastMessageAt: -1
        });

};

conversationSchema.statics.findBetweenUsers = function (
    buyerId,
    vendorId
) {

    return this.findOne({
        buyer: buyerId,
        vendor: vendorId
    });

};

conversationSchema.statics.findActive = function () {

    return this.find({
        status: "active"
    }).sort({
        lastMessageAt: -1
    });

};

// =============================================
// Query Helpers
// =============================================

conversationSchema.query.active = function () {

    return this.where({
        status: "active"
    });

};

conversationSchema.query.archived = function () {

    return this.where({
        status: "archived"
    });

};

conversationSchema.query.byProduct = function (productId) {

    return this.where({
        product: productId
    });

};

// =============================================
// JSON Transform
// =============================================

conversationSchema.set("toJSON", {

    virtuals: true,

    transform(doc, ret) {

        ret.id = ret._id;

        delete ret._id;
        delete ret.__v;

        return ret;

    }

});

// =============================================
// Pre Remove Middleware
// =============================================

conversationSchema.pre("deleteOne", { document: true }, function (next) {

    console.log(
        `Deleting conversation ${this._id}`
    );

    next();

});

// =============================================
// Post Save Middleware
// =============================================

conversationSchema.post("save", function (doc) {

    console.log(
        `Conversation saved: ${doc._id}`
    );

});

// =============================================
// Model
// =============================================

const Conversation = mongoose.model(
    "Conversation",
    conversationSchema
);

// =============================================
// Export
// =============================================

module.exports = Conversation;
