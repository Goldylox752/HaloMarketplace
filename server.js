// ==========================================
// HALO MARKETPLACE SERVER
// server.js
// ==========================================

require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const rateLimit = require("express-rate-limit");
const path = require("path");

const app = express();

// ==========================================
// CONFIG
// ==========================================

const PORT = process.env.PORT || 5000;

// ==========================================
// SECURITY
// ==========================================

app.use(helmet());

app.use(cors({
    origin: true,
    credentials: true
}));

app.use(compression());

app.use(cookieParser());

app.use(express.json({
    limit: "10mb"
}));

app.use(express.urlencoded({
    extended: true,
    limit: "10mb"
}));

app.use(morgan("dev"));

// ==========================================
// RATE LIMITER
// ==========================================

const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
    message: {
        success: false,
        message: "Too many requests. Please try again later."
    }
});

app.use("/api", apiLimiter);

// ==========================================
// STATIC FILES
// ==========================================

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use(express.static(path.join(__dirname, "../frontend")));

// ==========================================
// HEALTH CHECK
// ==========================================

app.get("/api/health", (req, res) => {

    res.status(200).json({

        success: true,

        application: "Halo Marketplace",

        version: "1.0.0",

        status: "Running",

        uptime: process.uptime(),

        timestamp: new Date()

    });

});

// ==========================================
// ROOT
// ==========================================

app.get("/", (req, res) => {

    res.sendFile(path.join(__dirname, "../frontend/index.html"));

});

// ==========================================
// API PLACEHOLDERS
// ==========================================

app.use("/api/auth", require("./routes/auth"));
app.use("/api/users", require("./routes/users"));
app.use("/api/stores", require("./routes/stores"));
app.use("/api/products", require("./routes/products"));
app.use("/api/categories", require("./routes/categories"));
app.use("/api/cart", require("./routes/cart"));
app.use("/api/orders", require("./routes/orders"));
app.use("/api/payments", require("./routes/payments"));
app.use("/api/reviews", require("./routes/reviews"));
app.use("/api/messages", require("./routes/messages"));
app.use("/api/subscriptions", require("./routes/subscriptions"));
app.use("/api/uploads", require("./routes/uploads"));
app.use("/api/search", require("./routes/search"));
app.use("/api/admin", require("./routes/admin"));

// ==========================================
// 404
// ==========================================

app.use((req, res) => {

    res.status(404).json({

        success: false,

        message: "Endpoint not found."

    });

});

// ==========================================
// ERROR HANDLER
// ==========================================

app.use((err, req, res, next) => {

    console.error(err);

    res.status(err.status || 500).json({

        success: false,

        message: err.message || "Internal Server Error"

    });

});

// ==========================================
// START SERVER
// ==========================================

app.listen(PORT, () => {

    console.log("");

    console.log("===================================");

    console.log(" Halo Marketplace");

    console.log("===================================");

    console.log(`Running on port ${PORT}`);

    console.log(`http://localhost:${PORT}`);

    console.log("===================================");

});

const paymentRoutes = require("./routes/paymentRoutes");

// Stripe webhook (must come before express.json)
app.use("/api/payments", paymentRoutes);

// JSON parser for the rest of your API
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
