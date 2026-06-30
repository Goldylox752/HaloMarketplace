// ========================================
// Halo Marketplace
// index.js
// Main Server Entry Point
// ========================================

require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const helmet = require("helmet");
const compression = require("compression");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");
const morgan = require("morgan");

const app = express();

const PORT = process.env.PORT || 3000;

// ========================================
// Security
// ========================================

app.use(helmet());

app.use(cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true
}));

// ========================================
// Middleware
// ========================================

app.use(express.json({
    limit: "10mb"
}));

app.use(express.urlencoded({
    extended: true
}));

app.use(cookieParser());

app.use(compression());

app.use(morgan("dev"));

// ========================================
// Static Folder
// ========================================

app.use(express.static(path.join(__dirname, "public")));

// ========================================
// Routes
// ========================================

app.use("/api/auth", require("./routes/auth"));
app.use("/api/users", require("./routes/users"));
app.use("/api/products", require("./routes/products"));
app.use("/api/categories", require("./routes/categories"));
app.use("/api/orders", require("./routes/orders"));
app.use("/api/payments", require("./routes/payments"));
app.use("/api/vendors", require("./routes/vendors"));
app.use("/api/upload", require("./routes/upload"));
app.use("/api/reviews", require("./routes/reviews"));
app.use("/api/messages", require("./routes/messages"));
app.use("/api/search", require("./routes/search"));
app.use("/api/admin", require("./routes/admin"));

// ========================================
// Health Check
// ========================================

app.get("/api/health", (req, res) => {
    res.status(200).json({
        success: true,
        app: "Halo Marketplace",
        status: "Running",
        uptime: process.uptime(),
        timestamp: new Date()
    });
});

// ========================================
// SPA Routing
// ========================================

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// ========================================
// Error Handler
// ========================================

app.use((err, req, res, next) => {

    console.error(err.stack);

    res.status(err.status || 500).json({
        success: false,
        message: err.message || "Internal Server Error"
    });

});

// ========================================
// MongoDB Connection
// ========================================

mongoose
.connect(process.env.MONGO_URI, {

})
.then(() => {

    console.log("================================");
    console.log("MongoDB Connected");
    console.log("================================");

    app.listen(PORT, () => {

        console.log("================================");
        console.log(`Halo Marketplace Running`);
        console.log(`Server: http://localhost:${PORT}`);
        console.log(`Environment: ${process.env.NODE_ENV}`);
        console.log("================================");

    });

})
.catch(err => {

    console.error("MongoDB Connection Failed");
    console.error(err);

    process.exit(1);

});

// ========================================
// Handle Unhandled Rejections
// ========================================

process.on("unhandledRejection", err => {

    console.error(err);

    process.exit(1);

});

// ========================================
// Handle Uncaught Exceptions
// ========================================

process.on("uncaughtException", err => {

    console.error(err);

    process.exit(1);

});
