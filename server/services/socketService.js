// =============================================
// Halo Marketplace
// server/services/socketService.js
// Part 1 of 2
// =============================================

"use strict";

/*
|--------------------------------------------------------------------------
| Socket Service
|--------------------------------------------------------------------------
|
| Central service used by controllers to communicate with Socket.IO.
| Controllers should NEVER import socket.io directly.
|
| Example:
|
| const socketService = require("../services/socketService");
|
| socketService.notifyUser(userId, "notification:new", {
|     title: "Order Confirmed",
|     message: "Your order has been placed."
| });
|
*/

let io = null;

// =============================================
// Initialize
// =============================================

function initialize(socketIO) {

    io = socketIO;

    console.log("✓ Socket Service Ready");

}

// =============================================
// Helpers
// =============================================

function getIO() {

    if (!io) {
        throw new Error(
            "Socket.IO has not been initialized."
        );
    }

    return io;

}

function isInitialized() {

    return io !== null;

}

// =============================================
// User Notifications
// =============================================

function notifyUser(userId, event, payload = {}) {

    if (!isInitialized()) return false;

    getIO()
        .to(`user:${userId}`)
        .emit(event, payload);

    return true;

}

// =============================================
// Room Notifications
// =============================================

function notifyRoom(roomId, event, payload = {}) {

    if (!isInitialized()) return false;

    getIO()
        .to(roomId)
        .emit(event, payload);

    return true;

}

// =============================================
// Broadcast
// =============================================

function broadcast(event, payload = {}) {

    if (!isInitialized()) return false;

    getIO().emit(event, payload);

    return true;

}

// =============================================
// Admin Broadcast
// =============================================

function notifyAdmins(event, payload = {}) {

    if (!isInitialized()) return false;

    if (typeof getIO().broadcastAdmins === "function") {

        getIO().broadcastAdmins(event, payload);

    }

    return true;

}

// =============================================
// Vendor Broadcast
// =============================================

function notifyVendors(event, payload = {}) {

    if (!isInitialized()) return false;

    if (typeof getIO().broadcastVendors === "function") {

        getIO().broadcastVendors(event, payload);

    }

    return true;

}

// =============================================
// Customer Broadcast
// =============================================

function notifyCustomers(event, payload = {}) {

    if (!isInitialized()) return false;

    if (typeof getIO().broadcastCustomers === "function") {

        getIO().broadcastCustomers(event, payload);

    }

    return true;

}

// =============================================
// Chat
// =============================================

function sendChatMessage(roomId, message) {

    if (!isInitialized()) return false;

    getIO()
        .to(roomId)
        .emit("chat:message", message);

    return true;

}

function sendTyping(roomId, user) {

    if (!isInitialized()) return false;

    getIO()
        .to(roomId)
        .emit("chat:typing", user);

    return true;

}

function stopTyping(roomId, userId) {

    if (!isInitialized()) return false;

    getIO()
        .to(roomId)
        .emit("chat:stopTyping", {
            userId
        });

    return true;

}

// =============================================
// Notifications
// =============================================

function newNotification(userId, notification) {

    if (!isInitialized()) return false;

    getIO()
        .to(`notifications:${userId}`)
        .emit("notification:new", notification);

    return true;

}

// =============================================
// Halo Marketplace
// server/services/socketService.js
// Part 2 of 2
// =============================================

// =============================================
// Order Notifications
// =============================================

function orderCreated(userId, order) {

    return newNotification(userId, {
        type: "order",
        title: "Order Confirmed",
        message: `Your order #${order.orderNumber || order._id} has been placed successfully.`,
        orderId: order._id,
        createdAt: new Date()
    });

}

function orderUpdated(userId, order) {

    return newNotification(userId, {
        type: "order",
        title: "Order Updated",
        message: `Your order status is now "${order.status}".`,
        orderId: order._id,
        createdAt: new Date()
    });

}

function orderShipped(userId, order) {

    return newNotification(userId, {
        type: "shipping",
        title: "Order Shipped",
        message: "Your order is on its way!",
        trackingNumber: order.trackingNumber,
        orderId: order._id,
        createdAt: new Date()
    });

}

// =============================================
// Payment Notifications
// =============================================

function paymentReceived(userId, payment) {

    return newNotification(userId, {
        type: "payment",
        title: "Payment Received",
        message: `Payment of $${payment.amount} received.`,
        paymentId: payment._id,
        createdAt: new Date()
    });

}

function paymentFailed(userId, payment) {

    return newNotification(userId, {
        type: "payment",
        title: "Payment Failed",
        message: "Your payment could not be processed.",
        paymentId: payment._id,
        createdAt: new Date()
    });

}

// =============================================
// Product Notifications
// =============================================

function productSold(vendorId, product) {

    return newNotification(vendorId, {
        type: "product",
        title: "Product Sold",
        message: `${product.title} has been sold.`,
        productId: product._id,
        createdAt: new Date()
    });

}

function inventoryLow(vendorId, product) {

    return newNotification(vendorId, {
        type: "inventory",
        title: "Low Inventory",
        message: `${product.title} is running low on stock.`,
        productId: product._id,
        createdAt: new Date()
    });

}

// =============================================
// Reviews
// =============================================

function newReview(vendorId, review) {

    return newNotification(vendorId, {
        type: "review",
        title: "New Review",
        message: `You received a ${review.rating}-star review.`,
        reviewId: review._id,
        createdAt: new Date()
    });

}

// =============================================
// Presence
// =============================================

function userOnline(userId) {

    if (!isInitialized()) return false;

    return getIO().isUserOnline(userId);

}

function getOnlineUsers() {

    if (!isInitialized()) return [];

    return getIO().getOnlineUsers();

}

function getSocketId(userId) {

    if (!isInitialized()) return null;

    return getIO().getSocketId(userId);

}

// =============================================
// Rooms
// =============================================

function joinRoom(roomId, socketId) {

    if (!isInitialized()) return false;

    const socket = getIO().sockets.sockets.get(socketId);

    if (!socket) return false;

    socket.join(roomId);

    return true;

}

function leaveRoom(roomId, socketId) {

    if (!isInitialized()) return false;

    const socket = getIO().sockets.sockets.get(socketId);

    if (!socket) return false;

    socket.leave(roomId);

    return true;

}

// =============================================
// System Broadcasts
// =============================================

function maintenance(message) {

    return broadcast("system:maintenance", {
        title: "Scheduled Maintenance",
        message,
        createdAt: new Date()
    });

}

function announcement(title, message) {

    return broadcast("system:announcement", {
        title,
        message,
        createdAt: new Date()
    });

}

// =============================================
// Exports
// =============================================

module.exports = {
    initialize,
    getIO,
    isInitialized,

    notifyUser,
    notifyRoom,
    broadcast,

    notifyAdmins,
    notifyVendors,
    notifyCustomers,

    sendChatMessage,
    sendTyping,
    stopTyping,

    newNotification,

    orderCreated,
    orderUpdated,
    orderShipped,

    paymentReceived,
    paymentFailed,

    productSold,
    inventoryLow,

    newReview,

    userOnline,
    getOnlineUsers,
    getSocketId,

    joinRoom,
    leaveRoom,

    maintenance,
    announcement
};
