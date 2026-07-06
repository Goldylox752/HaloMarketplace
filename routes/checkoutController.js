// ========================================
// Halo Marketplace
// controllers/checkoutController.js
// Part 1A
// ========================================

const Cart = require("../models/Cart");
const Product = require("../models/Product");
const Coupon = require("../models/Coupon");
const Address = require("../models/Address");

const logger = require("../utils/logger");

// ========================================
// Constants
// ========================================

const TAX_RATE = 0.05;
const FREE_SHIPPING = 100;
const STANDARD_SHIPPING = 12.99;

// ========================================
// Calculate Cart Totals
// ========================================

const calculateTotals = async (cart) => {

    let subtotal = 0;

    for (const item of cart.items) {

        const product = await Product.findById(item.product);

        if (!product)
            continue;

        item.price = product.price;
        item.subtotal = product.price * item.quantity;

        subtotal += item.subtotal;

    }

    cart.subtotal = Number(subtotal.toFixed(2));

    cart.shipping =
        subtotal >= FREE_SHIPPING
            ? 0
            : STANDARD_SHIPPING;

    cart.tax = Number(
        (subtotal * TAX_RATE).toFixed(2)
    );

    cart.discount = cart.discount || 0;

    cart.total = Number(
        (
            cart.subtotal +
            cart.shipping +
            cart.tax -
            cart.discount
        ).toFixed(2)
    );

    return cart;

};

// ========================================
// Validate Cart Inventory
// ========================================

const validateCheckout = async (cart) => {

    const errors = [];

    for (const item of cart.items) {

        const product = await Product.findById(item.product);

        if (!product) {

            errors.push({
                product: item.product,
                message: "Product no longer exists."
            });

            continue;

        }

        if (!product.active) {

            errors.push({
                product: product._id,
                message: "Product is unavailable."
            });

        }

        if (product.inventory < item.quantity) {

            errors.push({
                product: product._id,
                message:
                    `${product.name} only has ` +
                    `${product.inventory} remaining.`
            });

        }

    }

    return errors;

};

// ========================================
// Validate Coupon
// ========================================

const validateCoupon = async (
    couponId,
    subtotal
) => {

    if (!couponId)
        return {
            valid: true,
            discount: 0
        };

    const coupon = await Coupon.findById(couponId);

    if (!coupon) {

        return {
            valid: false,
            message: "Coupon not found."
        };

    }

    if (!coupon.active) {

        return {
            valid: false,
            message: "Coupon inactive."
        };

    }

    if (
        coupon.expiresAt &&
        coupon.expiresAt < new Date()
    ) {

        return {
            valid: false,
            message: "Coupon expired."
        };

    }

    if (
        subtotal <
        coupon.minimumPurchase
    ) {

        return {
            valid: false,
            message:
                "Minimum purchase not reached."
        };

    }

    let discount = 0;

    if (
        coupon.discountType === "percentage"
    ) {

        discount =
            subtotal *
            (coupon.discountValue / 100);

        if (
            coupon.maximumDiscount &&
            discount >
                coupon.maximumDiscount
        ) {

            discount =
                coupon.maximumDiscount;

        }

    } else {

        discount = coupon.discountValue;

    }

    return {

        valid: true,

        discount: Number(
            discount.toFixed(2)
        ),

        coupon

    };

};

// ========================================
// Validate Shipping Address
// ========================================

const validateAddress = async (
    addressId,
    userId
) => {

    const address =
        await Address.findOne({

            _id: addressId,

            user: userId

        });

    if (!address) {

        return {

            valid: false,

            message:
                "Shipping address not found."

        };

    }

    return {

        valid: true,

        address

    };

};

// ========================================
// Continue in Part 1B
// ========================================

// ========================================
// Get Checkout Summary
// ========================================

exports.getCheckout = async (req, res) => {

    try {

        const cart = await Cart.findOne({
            user: req.user._id
        }).populate("items.product");

        if (!cart || cart.items.length === 0) {

            return res.status(400).json({
                success: false,
                message: "Your cart is empty."
            });

        }

        const inventoryErrors = await validateCheckout(cart);

        if (inventoryErrors.length > 0) {

            return res.status(400).json({
                success: false,
                message: "Some items in your cart are no longer available.",
                errors: inventoryErrors
            });

        }

        await calculateTotals(cart);

        const couponResult = await validateCoupon(
            cart.coupon,
            cart.subtotal
        );

        if (couponResult.valid) {

            cart.discount = couponResult.discount;

            await calculateTotals(cart);

        }

        await cart.save();

        return res.json({

            success: true,

            checkout: {

                items: cart.items,

                subtotal: cart.subtotal,

                shipping: cart.shipping,

                tax: cart.tax,

                discount: cart.discount,

                total: cart.total

            }

        });

    } catch (err) {

        logger.error(err);

        return res.status(500).json({

            success: false,

            message: "Unable to prepare checkout."

        });

    }

};

// ========================================
// Shipping Estimate
// ========================================

exports.estimateShipping = async (req, res) => {

    try {

        const cart = await Cart.findOne({
            user: req.user._id
        });

        if (!cart) {

            return res.status(404).json({
                success: false,
                message: "Cart not found."
            });

        }

        await calculateTotals(cart);

        let shippingMethod = "standard";

        if (req.body.method) {
            shippingMethod = req.body.method;
        }

        let shipping = cart.shipping;

        switch (shippingMethod) {

            case "express":
                shipping = 24.99;
                break;

            case "priority":
                shipping = 39.99;
                break;

            case "pickup":
                shipping = 0;
                break;

            default:
                shipping = cart.shipping;

        }

        return res.json({

            success: true,

            shipping: {

                method: shippingMethod,

                amount: Number(shipping.toFixed(2))

            }

        });

    } catch (err) {

        logger.error(err);

        return res.status(500).json({

            success: false,

            message: "Unable to estimate shipping."

        });

    }

};

// ========================================
// Tax Estimate
// ========================================

exports.estimateTax = async (req, res) => {

    try {

        const cart = await Cart.findOne({
            user: req.user._id
        });

        if (!cart) {

            return res.status(404).json({
                success: false,
                message: "Cart not found."
            });

        }

        await calculateTotals(cart);

        let province = req.body.province || "";

        let taxRate = 0.05;

        switch (province.toUpperCase()) {

            case "AB":
                taxRate = 0.05;
                break;

            case "BC":
                taxRate = 0.12;
                break;

            case "ON":
                taxRate = 0.13;
                break;

            case "QC":
                taxRate = 0.14975;
                break;

            case "NS":
                taxRate = 0.15;
                break;

            default:
                taxRate = TAX_RATE;

        }

        const tax = Number(
            (cart.subtotal * taxRate).toFixed(2)
        );

        return res.json({

            success: true,

            tax: {

                province,

                rate: taxRate,

                amount: tax

            }

        });

    } catch (err) {

        logger.error(err);

        return res.status(500).json({

            success: false,

            message: "Unable to estimate tax."

        });

    }

};

// ========================================
// Continue in Part 2A
// ========================================

// ========================================
// Stripe
// ========================================

const Stripe = require("stripe");

const stripe = new Stripe(
    process.env.STRIPE_SECRET_KEY
);

// ========================================
// Create Payment Intent
// ========================================

exports.createPaymentIntent = async (req, res) => {

    try {

        const cart = await Cart.findOne({
            user: req.user._id
        }).populate("items.product");

        if (!cart || cart.items.length === 0) {

            return res.status(400).json({
                success: false,
                message: "Your cart is empty."
            });

        }

        // Validate inventory
        const inventoryErrors =
            await validateCheckout(cart);

        if (inventoryErrors.length > 0) {

            return res.status(400).json({

                success: false,

                errors: inventoryErrors

            });

        }

        // Recalculate totals
        await calculateTotals(cart);

        // Apply coupon if one exists
        if (cart.coupon) {

            const couponResult =
                await validateCoupon(
                    cart.coupon,
                    cart.subtotal
                );

            if (!couponResult.valid) {

                return res.status(400).json({

                    success: false,

                    message: couponResult.message

                });

            }

            cart.discount =
                couponResult.discount;

            await calculateTotals(cart);

        }

        await cart.save();

        // Stripe works in cents
        const amount = Math.round(
            cart.total * 100
        );

        const paymentIntent =
            await stripe.paymentIntents.create({

                amount,

                currency: "cad",

                automatic_payment_methods: {
                    enabled: true
                },

                metadata: {

                    userId:
                        req.user._id.toString(),

                    cartId:
                        cart._id.toString(),

                    itemCount:
                        cart.items.length.toString(),

                    subtotal:
                        cart.subtotal.toString(),

                    tax:
                        cart.tax.toString(),

                    shipping:
                        cart.shipping.toString(),

                    discount:
                        cart.discount.toString(),

                    total:
                        cart.total.toString()

                }

            });

        logger.info(

            `Payment Intent Created: ${paymentIntent.id}`

        );

        return res.json({

            success: true,

            clientSecret:
                paymentIntent.client_secret,

            paymentIntentId:
                paymentIntent.id,

            amount:
                cart.total,

            currency: "CAD"

        });

    }

    catch (err) {

        logger.error(err);

        return res.status(500).json({

            success: false,

            message:
                "Unable to create payment intent."

        });

    }

};

// ========================================
// Save Checkout Address
// ========================================

exports.saveCheckoutAddress = async (
    req,
    res
) => {

    try {

        const {

            addressId

        } = req.body;

        const validation =
            await validateAddress(
                addressId,
                req.user._id
            );

        if (!validation.valid) {

            return res.status(400).json({

                success: false,

                message:
                    validation.message

            });

        }

        const cart =
            await Cart.findOne({

                user:
                    req.user._id

            });

        if (!cart) {

            return res.status(404).json({

                success: false,

                message:
                    "Cart not found."

            });

        }

        cart.shippingAddress =
            validation.address._id;

        await cart.save();

        return res.json({

            success: true,

            message:
                "Shipping address saved."

        });

    }

    catch (err) {

        logger.error(err);

        return res.status(500).json({

            success: false,

            message:
                "Unable to save address."

        });

    }

};

// ========================================
// Get Payment Methods
// ========================================

exports.getPaymentMethods = async (
    req,
    res
) => {

    return res.json({

        success: true,

        methods: [

            {
                id: "card",
                name: "Credit / Debit Card"
            },

            {
                id: "apple_pay",
                name: "Apple Pay"
            },

            {
                id: "google_pay",
                name: "Google Pay"
            }

        ]

    });

};

// ========================================
// Continue in Part 2B
// ========================================

// ========================================
// Confirm Stripe Payment
// ========================================

exports.confirmPayment = async (req, res) => {

    try {

        const { paymentIntentId } = req.body;

        if (!paymentIntentId) {

            return res.status(400).json({
                success: false,
                message: "Payment Intent ID is required."
            });

        }

        const paymentIntent =
            await stripe.paymentIntents.retrieve(
                paymentIntentId
            );

        if (!paymentIntent) {

            return res.status(404).json({
                success: false,
                message: "Payment not found."
            });

        }

        if (
            paymentIntent.metadata.userId !==
            req.user._id.toString()
        ) {

            return res.status(403).json({
                success: false,
                message: "Payment does not belong to this user."
            });

        }

        if (
            paymentIntent.status !== "succeeded"
        ) {

            return res.status(400).json({
                success: false,
                message: "Payment has not completed.",
                status: paymentIntent.status
            });

        }

        const cart = await Cart.findOne({
            user: req.user._id
        }).populate("items.product");

        if (!cart) {

            return res.status(404).json({
                success: false,
                message: "Cart not found."
            });

        }

        await calculateTotals(cart);

        return res.json({

            success: true,

            message: "Payment verified.",

            payment: {

                id: paymentIntent.id,

                amount:
                    paymentIntent.amount_received / 100,

                currency:
                    paymentIntent.currency,

                status:
                    paymentIntent.status

            }

        });

    }

    catch (err) {

        logger.error(err);

        return res.status(500).json({

            success: false,

            message: "Unable to verify payment."

        });

    }

};

// ========================================
// Cancel Payment
// ========================================

exports.cancelPayment = async (req, res) => {

    try {

        const { paymentIntentId } = req.body;

        if (!paymentIntentId) {

            return res.status(400).json({
                success: false,
                message: "Payment Intent ID required."
            });

        }

        const paymentIntent =
            await stripe.paymentIntents.cancel(
                paymentIntentId
            );

        logger.info(
            `Payment cancelled: ${paymentIntent.id}`
        );

        return res.json({

            success: true,

            paymentIntent

        });

    }

    catch (err) {

        logger.error(err);

        return res.status(500).json({

            success: false,

            message: "Unable to cancel payment."

        });

    }

};

// ========================================
// Get Payment Status
// ========================================

exports.getPaymentStatus = async (
    req,
    res
) => {

    try {

        const paymentIntent =
            await stripe.paymentIntents.retrieve(
                req.params.id
            );

        return res.json({

            success: true,

            status: paymentIntent.status,

            amount:
                paymentIntent.amount / 100,

            currency:
                paymentIntent.currency

        });

    }

    catch (err) {

        logger.error(err);

        return res.status(500).json({

            success: false,

            message:
                "Unable to retrieve payment."

        });

    }

};

// ========================================
// Place Order (Part 3A.1)
// ========================================

const mongoose = require("mongoose");
const Order = require("../models/Order");

exports.placeOrder = async (req, res) => {

    const session = await mongoose.startSession();

    try {

        session.startTransaction();

        const {
            paymentIntentId,
            shippingAddressId,
            notes
        } = req.body;

        // ----------------------------------
        // Verify Stripe Payment
        // ----------------------------------

        const paymentIntent =
            await stripe.paymentIntents.retrieve(
                paymentIntentId
            );

        if (!paymentIntent) {

            await session.abortTransaction();

            return res.status(404).json({
                success: false,
                message: "Payment not found."
            });

        }

        if (paymentIntent.status !== "succeeded") {

            await session.abortTransaction();

            return res.status(400).json({
                success: false,
                message: "Payment has not been completed."
            });

        }

        if (
            paymentIntent.metadata.userId !==
            req.user._id.toString()
        ) {

            await session.abortTransaction();

            return res.status(403).json({
                success: false,
                message: "Payment verification failed."
            });

        }

        // ----------------------------------
        // Load Cart
        // ----------------------------------

        const cart = await Cart.findOne({
            user: req.user._id
        })
            .populate("items.product")
            .session(session);

        if (!cart || cart.items.length === 0) {

            await session.abortTransaction();

            return res.status(400).json({
                success: false,
                message: "Cart is empty."
            });

        }

        // ----------------------------------
        // Validate Inventory
        // ----------------------------------

        const inventoryErrors =
            await validateCheckout(cart);

        if (inventoryErrors.length > 0) {

            await session.abortTransaction();

            return res.status(400).json({
                success: false,
                errors: inventoryErrors
            });

        }

        // ----------------------------------
        // Validate Shipping Address
        // ----------------------------------

        const addressValidation =
            await validateAddress(
                shippingAddressId,
                req.user._id
            );

        if (!addressValidation.valid) {

            await session.abortTransaction();

            return res.status(400).json({
                success: false,
                message: addressValidation.message
            });

        }

        // ----------------------------------
        // Recalculate Totals
        // ----------------------------------

        await calculateTotals(cart);

        // ----------------------------------
        // Create Order
        // ----------------------------------

        const order = new Order({

            customer: req.user._id,

            orderNumber:
                `HALO-${Date.now()}`,

            items: cart.items.map(item => ({

                product: item.product._id,

                vendor: item.vendor,

                quantity: item.quantity,

                price: item.price,

                subtotal: item.subtotal

            })),

            subtotal: cart.subtotal,

            tax: cart.tax,

            shipping: cart.shipping,

            discount: cart.discount,

            total: cart.total,

            paymentStatus: "paid",

            paymentIntentId,

            orderStatus: "processing",

            shippingAddress:
                addressValidation.address,

            notes: notes || ""

        });

        await order.save({ session });

        // ----------------------------------
        // Continue in Part 3A.2
        // ----------------------------------

          // ----------------------------------
        // Update Inventory
        // ----------------------------------

        for (const item of cart.items) {

            const product = await Product.findById(
                item.product._id
            ).session(session);

            if (!product) {

                throw new Error(
                    `Product ${item.product._id} not found.`
                );

            }

            if (product.inventory < item.quantity) {

                throw new Error(
                    `${product.name} is out of stock.`
                );

            }

            product.inventory -= item.quantity;

            product.salesCount =
                (product.salesCount || 0) +
                item.quantity;

            await product.save({ session });

        }

        // ----------------------------------
        // Clear Cart
        // ----------------------------------

        cart.items = [];
        cart.coupon = null;
        cart.discount = 0;
        cart.subtotal = 0;
        cart.tax = 0;
        cart.shipping = 0;
        cart.total = 0;

        await cart.save({ session });

        // ----------------------------------
        // Commit Transaction
        // ----------------------------------

        await session.commitTransaction();

        logger.info(
            `Order ${order.orderNumber} created for user ${req.user._id}`
        );

        return res.status(201).json({

            success: true,

            message: "Order placed successfully.",

            order

        });

    } catch (err) {

        await session.abortTransaction();

        logger.error(err);

        return res.status(500).json({

            success: false,

            message: "Unable to place order.",

            error:
                process.env.NODE_ENV === "development"
                    ? err.message
                    : undefined

        });

    } finally {

        session.endSession();

    }

};
