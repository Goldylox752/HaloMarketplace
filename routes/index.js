// ========================================
// Halo Marketplace
// routes/index.js
// ========================================

const express = require("express");
const router = express.Router();

router.use("/auth", require("./authRoutes"));
router.use("/users", require("./userRoutes"));
router.use("/vendors", require("./vendorRoutes"));
router.use("/products", require("./productRoutes"));
router.use("/categories", require("./categoryRoutes"));
router.use("/brands", require("./brandRoutes"));
router.use("/orders", require("./orderRoutes"));
router.use("/cart", require("./cartRoutes"));
router.use("/wishlist", require("./wishlistRoutes"));
router.use("/checkout", require("./checkoutRoutes"));
router.use("/payments", require("./paymentRoutes"));
router.use("/reviews", require("./reviewRoutes"));
router.use("/messages", require("./messageRoutes"));
router.use("/conversations", require("./conversationRoutes"));
router.use("/notifications", require("./notificationRoutes"));
router.use("/uploads", require("./uploadRoutes"));
router.use("/search", require("./searchRoutes"));
router.use("/coupons", require("./couponRoutes"));
router.use("/shipping", require("./shippingRoutes"));
router.use("/addresses", require("./addressRoutes"));
router.use("/inventory", require("./inventoryRoutes"));
router.use("/analytics", require("./analyticsRoutes"));
router.use("/reports", require("./reportRoutes"));
router.use("/support", require("./supportRoutes"));
router.use("/dashboard", require("./dashboardRoutes"));
router.use("/stripe", require("./stripeRoutes"));
router.use("/webhooks", require("./webhookRoutes"));
router.use("/admin", require("./adminRoutes"));
router.use("/health", require("./healthRoutes"));

module.exports = router;
