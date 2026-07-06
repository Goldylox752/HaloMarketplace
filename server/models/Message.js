// =============================================
// Halo Marketplace
// server/models/Message.js
// Part 1 of 2
// =============================================

"use strict";

const mongoose = require("mongoose");

const { Schema } = mongoose;

// =============================================
// Attachment Schema
// =============================================

const attachmentSchema = new Schema(
    {
        filename: {
            type: String,
            trim: true
        },

        originalName: {
            type: String,
            trim: true
        },

        url: {
            type: String,
            trim: true
        },

        mimeType: {
            type: String,
            trim: true
        },

        size: {
            type: Number,
            default: 0
        }
    },
    {
        _id: false
    }
);

// =============================================
// Reaction Schema
// =============================================

const reactionSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        emoji: {
            type: String,
            required: true,
            trim: true
        },

        createdAt: {
            type: Date,
            default: Date.now
        }
    },
    {
        _id: false
    }
);

// =============================================
// Read Receipt Schema
// =============================================

const readReceiptSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        readAt: {
            type: Date,
            default: Date.now
        }
    },
    {
        _id: false
    }
);

// =============================================
// Message Schema
// =============================================

const messageSchema = new Schema(
    {
        conversation: {
            type: Schema.Types.ObjectId,
            ref: "Conversation",
            required: true,
            index: true
        },

        sender: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true
        },

        body: {
            type: String,
            required: true,
            trim: true,
            maxlength: 2000
        },

        messageType: {
            type: String,
            enum: [
                "text",
                "image",
                "file",
                "system"
            ],
            default: "text",
            index: true
        },

        attachments: [attachmentSchema],

        reactions: [reactionSchema],

        readBy: [readReceiptSchema],

        edited: {
            type: Boolean,
            default: false
        },

        editedAt: {
            type: Date,
            default: null
        },

        deleted: {
            type: Boolean,
            default: false
        },

        deletedAt: {
            type: Date,
            default: null
        },

        deletedBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
            default: null
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

messageSchema.index({
    conversation: 1,
    createdAt: 1
});

messageSchema.index({
    sender: 1,
    createdAt: -1
});

messageSchema.index({
    deleted: 1
});

messageSchema.index({
    messageType: 1
});

// =============================================
// Virtuals
// =============================================

messageSchema.virtual("hasAttachments").get(function () {
    return this.attachments.length > 0;
});

messageSchema.virtual("reactionCount").get(function () {
    return this.reactions.length;
});

messageSchema.virtual("isRead").get(function () {
    return this.readBy.length > 0;
});

// =============================================
// Pre Save Middleware
// =============================================

messageSchema.pre("save", function (next) {

    this.body = this.body.trim();

    next();

});

// =============================================
// Halo Marketplace
// server/models/Message.js
// Part 2 of 2
// =============================================

// =============================================
// Instance Methods
// =============================================

messageSchema.methods.markRead = async function (userId) {

    const exists = this.readBy.some(
        receipt => receipt.user.toString() === userId.toString()
    );

    if (!exists) {

        this.readBy.push({
            user: userId,
            readAt: new Date()
        });

        await this.save();
    }

    return this;
};

messageSchema.methods.editMessage = async function (newBody) {

    this.body = String(newBody).trim();
    this.edited = true;
    this.editedAt = new Date();

    return this.save();

};

messageSchema.methods.softDelete = async function (userId) {

    this.deleted = true;
    this.deletedAt = new Date();
    this.deletedBy = userId;

    return this.save();

};

messageSchema.methods.restore = async function () {

    this.deleted = false;
    this.deletedAt = null;
    this.deletedBy = null;

    return this.save();

};

messageSchema.methods.addReaction = async function (userId, emoji) {

    const existing = this.reactions.find(
        reaction =>
            reaction.user.toString() === userId.toString() &&
            reaction.emoji === emoji
    );

    if (!existing) {

        this.reactions.push({
            user: userId,
            emoji,
            createdAt: new Date()
        });

        await this.save();
    }

    return this;

};

messageSchema.methods.removeReaction = async function (userId, emoji) {

    this.reactions = this.reactions.filter(
        reaction =>
            !(
                reaction.user.toString() === userId.toString() &&
                reaction.emoji === emoji
            )
    );

    return this.save();

};

// =============================================
// Static Methods
// =============================================

messageSchema.statics.findConversation = function (
    conversationId,
    limit = 50
) {

    return this.find({
        conversation: conversationId,
        deleted: false
    })
        .populate("sender", "username avatar")
        .sort({ createdAt: -1 })
        .limit(limit);

};

messageSchema.statics.findUnread = function (
    conversationId,
    userId
) {

    return this.find({
        conversation: conversationId,
        deleted: false,
        "readBy.user": {
            $ne: userId
        }
    });

};

messageSchema.statics.recentMessages = function (
    limit = 25
) {

    return this.find({
        deleted: false
    })
        .populate("sender", "username avatar")
        .populate("conversation")
        .sort({
            createdAt: -1
        })
        .limit(limit);

};

// =============================================
// Query Helpers
// =============================================

messageSchema.query.active = function () {

    return this.where({
        deleted: false
    });

};

messageSchema.query.images = function () {

    return this.where({
        messageType: "image"
    });

};

messageSchema.query.files = function () {

    return this.where({
        messageType: "file"
    });

};

messageSchema.query.bySender = function (senderId) {

    return this.where({
        sender: senderId
    });

};

// =============================================
// JSON Transform
// =============================================

messageSchema.set("toJSON", {

    virtuals: true,

    transform(doc, ret) {

        ret.id = ret._id;

        delete ret._id;
        delete ret.__v;

        return ret;

    }

});

// =============================================
// Middleware
// =============================================

messageSchema.post("save", function (doc) {

    console.log(
        `Message saved: ${doc._id}`
    );

});

messageSchema.pre(
    "deleteOne",
    { document: true },
    function (next) {

        console.log(
            `Deleting message: ${this._id}`
        );

        next();

    }
);

// =============================================
// Model
// =============================================

const Message = mongoose.model(
    "Message",
    messageSchema
);

// =============================================
// Export
// =============================================

module.exports = Message;


