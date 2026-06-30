const express = require("express");
const router = express.Router();

const {
    createOrder,
    getMyOrders,
    getSellerOrders,
    getOrder,
    updateOrderStatus,
    cancelOrder
} = require("../controllers/orderController");

const { protect } = require("../middleware/auth");

// All order routes require authentication
router.use(protect);

// Buyer
router.post("/", createOrder);
router.get("/my-orders", getMyOrders);

// Seller
router.get("/seller", getSellerOrders);
router.put("/:id/status", updateOrderStatus);

// Buyer or Seller
router.get("/:id", getOrder);

// Buyer
router.put("/:id/cancel", cancelOrder);

module.exports = router;
