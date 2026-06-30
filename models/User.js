// ==========================================
// models/User.js
// Halo Marketplace User Model
// ==========================================

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
{
    firstName: {
        type: String,
        required: true,
        trim: true,
        maxlength: 50
    },

    lastName: {
        type: String,
        required: true,
        trim: true,
        maxlength: 50
    },

    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        minlength: 3,
        maxlength: 30
    },

    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },

    password: {
        type: String,
        required: true,
        minlength: 8,
        select: false
    },

    role: {
        type: String,
        enum: ["buyer", "vendor", "admin"],
        default: "buyer"
    },

    avatar: {
        type: String,
        default: ""
    },

    phone: {
        type: String,
        default: ""
    },

    bio: {
        type: String,
        maxlength: 500,
        default: ""
    },

    company: {
        type: String,
        default: ""
    },

    website: {
        type: String,
        default: ""
    },

    address: {
        street: {
            type: String,
            default: ""
        },

        city: {
            type: String,
            default: ""
        },

        province: {
            type: String,
            default: ""
        },

        postalCode: {
            type: String,
            default: ""
        },

        country: {
            type: String,
            default: "Canada"
        }
    },

    wishlist: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product"
        }
    ],

    isVerified: {
        type: Boolean,
        default: false
    },

    isActive: {
        type: Boolean,
        default: true
    },

    stripeCustomerId: {
        type: String,
        default: ""
    },

    stripeAccountId: {
        type: String,
        default: ""
    },

    lastLogin: {
        type: Date
    }

},
{
    timestamps: true
});

// ==========================================
// Hash Password Before Saving
// ==========================================

userSchema.pre("save", async function(next) {

    if (!this.isModified("password")) {
        return next();
    }

    const salt = await bcrypt.genSalt(12);

    this.password = await bcrypt.hash(this.password, salt);

    next();

});

// ==========================================
// Compare Password
// ==========================================

userSchema.methods.comparePassword = async function(password) {

    return await bcrypt.compare(password, this.password);

};

// ==========================================
// Remove Password from JSON
// ==========================================

userSchema.methods.toJSON = function() {

    const user = this.toObject();

    delete user.password;

    return user;

};

// ==========================================
// Export Model
// ==========================================

module.exports = mongoose.model("User", userSchema);
