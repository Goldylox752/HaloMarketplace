// ========================================
// Halo Marketplace
// server.js
// Production Express Server
// ========================================

require("dotenv").config();

const http = require("http");
const app = require("./app");

const {
    connectDatabase,
    disconnectDatabase
} = require("./config/database");

const initializeSocketServer = require("./sockets");

// ========================================
// CONFIG
// ========================================

const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || "development";

// ========================================
// SERVER START
// ========================================

async function startServer() {
    try {
        console.log("🔄 Connecting to database...");

        await connectDatabase();

        const server = http.createServer(app);

        // ========================================
        // SOCKET.IO
        // ========================================

        initializeSocketServer(server);

        // ========================================
        // SERVER TUNING
        // ========================================

        server.keepAliveTimeout = 65000;
        server.headersTimeout = 66000;
        server.requestTimeout = 300000;

        // ========================================
        // START LISTENING
        // ========================================

        server.listen(PORT, () => {
            logStartup();
        });

        // ========================================
        // SHUTDOWN
        // ========================================

        handleShutdown(server);

    } catch (error) {
        console.error("❌ Failed to start Halo Marketplace API");
        console.error(error);

        process.exit(1);
    }
}

// ========================================
// STARTUP LOGS
// ========================================

function logStartup() {

    console.clear();

    console.log(`
======================================================
               HALO MARKETPLACE API
======================================================

🚀 Status          : ONLINE
🌎 Environment     : ${NODE_ENV}
📡 Port            : ${PORT}
🗄 Database        : Connected
🔌 Socket.IO       : Enabled
💳 Stripe          : ${process.env.STRIPE_SECRET_KEY ? "Configured" : "Missing"}
🪝 Stripe Webhook  : /api/webhooks/stripe
📦 Version         : 1.0.0

======================================================
 Ready to accept connections...
======================================================
`);
}

// ========================================
// GRACEFUL SHUTDOWN
// ========================================

function handleShutdown(server) {

    async function shutdown(signal) {

        console.log(`\n⚠️ ${signal} received...`);
        console.log("🛑 Shutting down Halo Marketplace...");

        server.close(async () => {

            console.log("✅ HTTP server closed");

            try {

                if (disconnectDatabase) {
                    await disconnectDatabase();
                    console.log("✅ Database disconnected");
                }

                console.log("👋 Shutdown complete");

                process.exit(0);

            } catch (error) {

                console.error("❌ Shutdown Error");
                console.error(error);

                process.exit(1);

            }

        });

    }

    process.on("SIGINT", () => shutdown("SIGINT"));
    process.on("SIGTERM", () => shutdown("SIGTERM"));
}

// ========================================
// GLOBAL ERROR HANDLING
// ========================================

process.on("unhandledRejection", (reason) => {

    console.error("\n❌ Unhandled Promise Rejection");
    console.error(reason);

});

process.on("uncaughtException", (error) => {

    console.error("\n❌ Uncaught Exception");
    console.error(error);

    process.exit(1);

});

// ========================================
// BOOT SERVER
// ========================================

startServer();
