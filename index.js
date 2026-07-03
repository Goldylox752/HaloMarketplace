// ==========================================
// HALO MARKETPLACE
// index.js
// ==========================================

require("dotenv").config();

const express = require("express");
const helmet = require("helmet");
const compression = require("compression");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const path = require("path");

const { PrismaClient } = require("@prisma/client");
const logger = require("./utils/logger");

const app = express();
const prisma = new PrismaClient();

const PORT = process.env.PORT || 5000;

// ==========================================
// SECURITY
// ==========================================

app.set("trust proxy", 1);

app.use(helmet());

app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
}));

// ==========================================
// MIDDLEWARE
// ==========================================

app.use(express.json({
    limit: "10mb"
}));

app.use(express.urlencoded({
    extended: true,
    limit: "10mb"
}));

app.use(cookieParser());
app.use(compression());
app.use(morgan("dev"));

// ==========================================
// STATIC FILES
// ==========================================

app.use(express.static(path.join(__dirname, "public")));

// ==========================================
// ROUTES
// ==========================================

app.use("/api/auth", require("./routes/auth"));
app.use("/api/users", require("./routes/users"));
app.use("/api/products", require("./routes/products"));
app.use("/api/categories", require("./routes/categories"));
app.use("/api/orders", require("./routes/orders"));
app.use("/api/payments", require("./routes/payments"));
app.use("/api/vendors", require("./routes/vendors"));
app.use("/api/reviews", require("./routes/reviews"));
app.use("/api/messages", require("./routes/messages"));
app.use("/api/search", require("./routes/search"));
app.use("/api/admin", require("./routes/admin"));
app.use("/api/uploads", require("./routes/uploads"));

// ==========================================
// HEALTH CHECK
// ==========================================

app.get("/api/health", async (req, res) => {

    try {

        await prisma.$queryRaw`SELECT 1`;

        res.json({

            success: true,

            application: "Halo Marketplace",

            status: "Running",

            database: "Connected",

            uptime: process.uptime(),

            timestamp: new Date()

        });

    } catch (err) {

        res.status(500).json({

            success: false,

            database: "Disconnected"

        });

    }

});

// ==========================================
// SPA
// ==========================================

app.get("*", (req, res) => {

    res.sendFile(path.join(__dirname, "public", "index.html"));

});

// ==========================================
// ERROR HANDLER
// ==========================================

app.use((err, req, res, next) => {

    logger.error(err.stack || err.message);

    res.status(err.status || 500).json({

        success: false,

        message: err.message || "Internal Server Error"

    });

});

// ==========================================
// START SERVER
// ==========================================

async function startServer() {

    try {

        await prisma.$connect();

        logger.success("Database Connected");

        app.listen(PORT, () => {

            logger.success("====================================");
            logger.success("Halo Marketplace");
            logger.success(`Running on http://localhost:${PORT}`);
            logger.success(`Environment: ${process.env.NODE_ENV}`);
            logger.success("====================================");

        });

    } catch (err) {

        logger.error(err.message);

        process.exit(1);

    }

}

startServer();

// ==========================================
// SHUTDOWN
// ==========================================

process.on("SIGINT", async () => {

    logger.warn("Server shutting down...");

    await prisma.$disconnect();

    process.exit(0);

});

process.on("SIGTERM", async () => {

    await prisma.$disconnect();

    process.exit(0);

});

process.on("unhandledRejection", err => {

    logger.error(err.stack || err.message);

});

process.on("uncaughtException", err => {

    logger.error(err.stack || err.message);

    process.exit(1);

});
