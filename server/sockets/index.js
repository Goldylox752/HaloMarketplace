// =============================================
// Halo Marketplace
// server/sockets/index.js
// Socket.IO Initialization & Authentication
// Part 1 of 2
// =============================================

"use strict";

const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");

// Socket Modules
const registerChatHandlers = require("./chat");
const registerNotificationHandlers = require("./notification");

// =============================================
// Online User Store
// =============================================

const onlineUsers = new Map();     // userId -> socketId
const userSockets = new Map();     // socketId -> user
const activeRooms = new Map();     // roomId -> Set(socketIds)

// =============================================
// Helper Functions
// =============================================

function addOnlineUser(userId, socketId) {
    onlineUsers.set(String(userId), socketId);
}

function removeOnlineUser(userId) {
    onlineUsers.delete(String(userId));
}

function getSocketId(userId) {
    return onlineUsers.get(String(userId));
}

function isOnline(userId) {
    return onlineUsers.has(String(userId));
}

function getOnlineUsers() {
    return [...onlineUsers.keys()];
}

function joinRoom(roomId, socketId) {

    if (!activeRooms.has(roomId)) {
        activeRooms.set(roomId, new Set());
    }

    activeRooms.get(roomId).add(socketId);
}

function leaveRoom(roomId, socketId) {

    if (!activeRooms.has(roomId)) return;

    activeRooms.get(roomId).delete(socketId);

    if (activeRooms.get(roomId).size === 0) {
        activeRooms.delete(roomId);
    }
}

function removeSocketFromRooms(socketId) {

    for (const [roomId, sockets] of activeRooms.entries()) {

        if (sockets.has(socketId)) {

            sockets.delete(socketId);

            if (sockets.size === 0) {
                activeRooms.delete(roomId);
            }

        }

    }

}

function getRoomMembers(roomId) {

    if (!activeRooms.has(roomId)) {
        return [];
    }

    return [...activeRooms.get(roomId)];

}

// =============================================
// JWT Authentication Middleware
// =============================================

function authenticateSocket(socket, next) {

    try {

        const token =
            socket.handshake.auth?.token ||
            socket.handshake.headers?.authorization?.replace("Bearer ", "") ||
            socket.handshake.query?.token;

        if (!token) {
            return next(new Error("Authentication token missing."));
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        socket.user = {
            id: decoded.id,
            email: decoded.email,
            username: decoded.username,
            role: decoded.role
        };

        return next();

    } catch (err) {

        console.error("Socket Authentication Error:", err.message);

        return next(new Error("Authentication failed."));

    }

}

// =============================================
// Socket.IO Bootstrap
// =============================================

function initializeSocket(server) {

    const io = new Server(server, {

        cors: {
            origin: process.env.CLIENT_URL || "*",
            credentials: true,
            methods: ["GET", "POST"]
        },

        transports: [
            "websocket",
            "polling"
        ],

        pingTimeout: 30000,
        pingInterval: 25000

    });

    // Authenticate every socket
    io.use(authenticateSocket);

    // =========================================
    // Connection
    // =========================================

    io.on("connection", (socket) => {

        const user = socket.user;

        console.log(
            `Socket Connected: ${user.username} (${socket.id})`
        );

        // Store user
        addOnlineUser(user.id, socket.id);
        userSockets.set(socket.id, user);

        // Personal room
        socket.join(`user:${user.id}`);

        // Presence
        socket.broadcast.emit("user:online", {
            userId: user.id
        });

        // Send currently online users
        socket.emit("presence:init", {
            onlineUsers: getOnlineUsers()
        });

        // =====================================
        // Room Events
        // =====================================

        socket.on("room:join", (roomId) => {

            if (!roomId) return;

            socket.join(roomId);

            joinRoom(roomId, socket.id);

            io.to(roomId).emit("room:userJoined", {

                roomId,
                userId: user.id,
                members: getRoomMembers(roomId).length

            });

        });

        socket.on("room:leave", (roomId) => {

            if (!roomId) return;

            socket.leave(roomId);

            leaveRoom(roomId, socket.id);

            io.to(roomId).emit("room:userLeft", {

                roomId,
                userId: user.id,
                members: getRoomMembers(roomId).length

            });

        });

        // Register feature handlers
        registerChatHandlers(io, socket);
        registerNotificationHandlers(io, socket);
