// ========================================
// Halo Marketplace
// app.js
// Part 1A
// ========================================

require("dotenv").config();

const express = require("express");
const path = require("path");

const helmet = require("helmet");
const cors = require("cors");
const compression = require("compression");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");

const rateLimit = require("express-rate-limit");

const app = express();

// ========================================
// TRUST PROXY
// ========================================

// Required when running behind
// Render, Railway, Nginx, Cloudflare, etc.

app.set("trust proxy", 1);

// ========================================
// SECURITY HEADERS
// ========================================

app.use(
    helmet({

        crossOriginResourcePolicy: {
            policy: "cross-origin"
        }

    })
);

// ========================================
// CORS
// ========================================

const allowedOrigins = [

    process.env.FRONTEND_URL,

    "http://localhost:3000",

    "http://localhost:5173"

].filter(Boolean);

app.use(

    cors({

        origin(origin, callback) {

            // Allow Postman/mobile apps
            if (!origin) {

                return callback(null, true);

            }

            if (allowedOrigins.includes(origin)) {

                return callback(null, true);

            }

            return callback(
                new Error("CORS not allowed.")
            );

        },

        credentials: true,

        methods: [
            "GET",
            "POST",
            "PUT",
            "PATCH",
            "DELETE",
            "OPTIONS"
        ],

        allowedHeaders: [
            "Content-Type",
            "Authorization"
        ]

    })

);

// ========================================
// COMPRESSION
// ========================================

app.use(compression());

// ========================================
// LOGGING
// ========================================

app.use(

    morgan(

        process.env.NODE_ENV === "production"

            ? "combined"

            : "dev"

    )

);

// ========================================
// COOKIES
// ========================================

app.use(cookieParser());

// ========================================
// STRIPE WEBHOOK
// IMPORTANT:
//
// Must come BEFORE express.json()
// because Stripe requires the raw body.
//
// Create routes/webhookRoutes.js
// ========================================

app.use(

    "/api/webhooks/stripe",

    express.raw({

        type: "application/json"

    }),

    require("./routes/webhookRoutes")

);

// ========================================
// BODY PARSER
// ========================================

app.use(

    express.json({

        limit: "10mb"

    })

);

app.use(

    express.urlencoded({

        extended: true,

        limit: "10mb"

    })

);

// ========================================
// API RATE LIMITER
// ========================================

const apiLimiter = rateLimit({

    windowMs: 15 * 60 * 1000,

    max:

        process.env.NODE_ENV === "production"

            ? 250

            : 5000,

    standardHeaders: true,

    legacyHeaders: false,

    message: {

        success: false,

        message:

            "Too many requests. Please try again later."

    }

});

app.use("/api", apiLimiter);

// ========================================
// Continue in Part 1B
// ========================================

module.exports = app;


// ========================================
// Halo Marketplace
// app.js
// Part 1B
// ========================================

// ========================================
// STATIC FILES
// ========================================

// Uploaded images
app.use(
    "/uploads",
    express.static(
        path.join(__dirname, "uploads")
    )
);

// Public assets
app.use(
    express.static(
        path.join(__dirname, "public")
    )
);

// ========================================
// HEALTH CHECK
// ========================================

app.get("/api/health", (req, res) => {

    res.status(200).json({

        success: true,

        application: "Halo Marketplace",

        version: process.env.npm_package_version || "1.0.0",

        environment:
            process.env.NODE_ENV || "development",

        uptime: process.uptime(),

        timestamp: new Date(),

        database: "Supabase PostgreSQL"

    });

});

// ========================================
// ROOT
// ========================================

app.get("/", (req, res) => {

    res.sendFile(

        path.join(
            __dirname,
            "public",
            "index.html"
        )

    );

});

// ========================================
// API ROUTES
// ========================================

app.use(
    "/api/auth",
    require("./routes/authRoutes")
);

app.use(
    "/api/users",
    require("./routes/userRoutes")
);

app.use(
    "/api/vendors",
    require("./routes/vendorRoutes")
);

app.use(
    "/api/products",
    require("./routes/productRoutes")
);

app.use(
    "/api/categories",
    require("./routes/categoryRoutes")
);

app.use(
    "/api/brands",
    require("./routes/brandRoutes")
);

app.use(
    "/api/cart",
    require("./routes/cartRoutes")
);

app.use(
    "/api/checkout",
    require("./routes/checkoutRoutes")
);

app.use(
    "/api/orders",
    require("./routes/orderRoutes")
);

app.use(
    "/api/payments",
    require("./routes/paymentRoutes")
);

app.use(
    "/api/reviews",
    require("./routes/reviewRoutes")
);

app.use(
    "/api/wishlist",
    require("./routes/wishlistRoutes")
);

app.use(
    "/api/search",
    require("./routes/searchRoutes")
);

app.use(
    "/api/uploads",
    require("./routes/uploadRoutes")
);

app.use(
    "/api/notifications",
    require("./routes/notificationRoutes")
);

app.use(
    "/api/admin",
    require("./routes/adminRoutes")
);

// ========================================
// FUTURE ROUTES
// ========================================

app.use(
    "/api/messages",
    require("./routes/messageRoutes")
);

app.use(
    "/api/chat",
    require("./routes/chatRoutes")
);

app.use(
    "/api/analytics",
    require("./routes/analyticsRoutes")
);

app.use(
    "/api/coupons",
    require("./routes/couponRoutes")
);

// ========================================
// Continue in Part 2
// ========================================

// ========================================
// Halo Marketplace
// app.js
// Part 2
// ========================================

// ========================================
// 404 - Route Not Found
// ========================================

app.use((req, res) => {

    return res.status(404).json({

        success: false,

        error: "Not Found",

        message: `Route ${req.originalUrl} does not exist.`,

        timestamp: new Date()

    });

});

// ========================================
// GLOBAL ERROR HANDLER
// ========================================

app.use((err, req, res, next) => {

    console.error("");
    console.error("=================================");
    console.error("APPLICATION ERROR");
    console.error("=================================");
    console.error(err.stack || err);
    console.error("=================================");
    console.error("");

    // Invalid JSON
    if (err instanceof SyntaxError && err.status === 400 && "body" in err) {

        return res.status(400).json({

            success: false,

            message: "Invalid JSON request body."

        });

    }

    // PostgreSQL Errors
    if (err.code === "23505") {

        return res.status(409).json({

            success: false,

            message: "A record with that value already exists."

        });

    }

    if (err.code === "23503") {

        return res.status(400).json({

            success: false,

            message: "Referenced record does not exist."

        });

    }

    if (err.code === "22P02") {

        return res.status(400).json({

            success: false,

            message: "Invalid request."

        });

    }

    // Unauthorized
    if (err.status === 401) {

        return res.status(401).json({

            success: false,

            message: "Unauthorized."

        });

    }

    // Forbidden
    if (err.status === 403) {

        return res.status(403).json({

            success: false,

            message: "Forbidden."

        });

    }

    // Validation Error
    if (err.status === 422) {

        return res.status(422).json({

            success: false,

            message: err.message

        });

    }

    // Default Error
    return res.status(err.status || 500).json({

        success: false,

        message:

            process.env.NODE_ENV === "production"

                ? "Internal Server Error"

                : err.message,

        ...(process.env.NODE_ENV !== "production" && {

            stack: err.stack

        })

    });

});

// ========================================
// UNHANDLED REJECTIONS
// ========================================

process.on("unhandledRejection", (reason) => {

    console.error("");

    console.error("Unhandled Promise Rejection");

    console.error(reason);

});

// ========================================
// UNCAUGHT EXCEPTIONS
// ========================================

process.on("uncaughtException", (err) => {

    console.error("");

    console.error("Uncaught Exception");

    console.error(err);

    process.exit(1);

});

// ========================================
// EXPORT EXPRESS APP
// ========================================

module.exports = app;
