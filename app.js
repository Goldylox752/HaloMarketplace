// ========================================
// Halo Marketplace
// app.js
// Production Express Application
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

app.set("trust proxy", 1);


// ========================================
// SECURITY
// ========================================

app.use(
    helmet({
        crossOriginResourcePolicy:{
            policy:"cross-origin"
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

        origin:(origin,callback)=>{

            if(!origin){
                return callback(null,true);
            }


            if(allowedOrigins.includes(origin)){
                return callback(null,true);
            }


            return callback(
                new Error("CORS blocked")
            );

        },

        credentials:true,

        methods:[
            "GET",
            "POST",
            "PUT",
            "PATCH",
            "DELETE",
            "OPTIONS"
        ],

        allowedHeaders:[
            "Content-Type",
            "Authorization"
        ]

    })
);


// ========================================
// PERFORMANCE
// ========================================

app.use(compression());


// ========================================
// LOGGING
// ========================================

app.use(
    morgan(
        process.env.NODE_ENV === "production"
        ?"combined"
        :"dev"
    )
);


// ========================================
// COOKIES
// ========================================

app.use(cookieParser());


// ========================================
// STRIPE WEBHOOK
// MUST BE BEFORE JSON
// ========================================

app.use(

"/api/webhooks/stripe",

express.raw({
    type:"application/json"
}),

require("./routes/webhookRoutes")

);


// ========================================
// BODY PARSER
// ========================================

app.use(
express.json({
    limit:"10mb"
})
);


app.use(
express.urlencoded({
    extended:true,
    limit:"10mb"
})
);


// ========================================
// RATE LIMIT
// ========================================

const limiter = rateLimit({

windowMs:
15 * 60 * 1000,


max:

process.env.NODE_ENV === "production"
?250
:5000,


standardHeaders:true,

legacyHeaders:false,


message:{
    success:false,
    message:"Too many requests."
}

});


app.use("/api",limiter);


// ========================================
// STATIC FILES
// ========================================

app.use(

"/uploads",

express.static(
path.join(__dirname,"uploads")
)

);


app.use(

express.static(

path.join(
__dirname,
"public"
)

)

);


// ========================================
// HEALTH CHECK
// ========================================

app.get("/api/health",(req,res)=>{


res.json({

success:true,

application:"Halo Marketplace",

version:"1.0.0",

environment:
process.env.NODE_ENV || "development",

database:"Supabase PostgreSQL",

uptime:process.uptime(),

timestamp:new Date()

});


});


// ========================================
// WEBSITE
// ========================================

app.get("/",(req,res)=>{


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


const routes = {

auth:"authRoutes",

users:"userRoutes",

vendors:"vendorRoutes",

products:"productRoutes",

categories:"categoryRoutes",

brands:"brandRoutes",

cart:"cartRoutes",

checkout:"checkoutRoutes",

orders:"orderRoutes",

payments:"paymentRoutes",

reviews:"reviewRoutes",

wishlist:"wishlistRoutes",

search:"searchRoutes",

notifications:"notificationRoutes",

admin:"adminRoutes",

messages:"messageRoutes",

chat:"chatRoutes",

analytics:"analyticsRoutes",

coupons:"couponRoutes"

};



Object.entries(routes).forEach(([pathName,file])=>{


app.use(

`/api/${pathName}`,

require(`./routes/${file}`)

);


});



// ========================================
// 404
// ========================================

app.use((req,res)=>{


res.status(404).json({

success:false,

message:
`Route ${req.originalUrl} not found`

});


});



// ========================================
// ERROR HANDLER
// ========================================

app.use((err,req,res,next)=>{


console.error(err);


res.status(
err.status || 500
)

.json({

success:false,

message:

process.env.NODE_ENV==="production"

?"Internal Server Error"

:err.message


});


});



// ========================================
// PROCESS ERRORS
// ========================================

process.on(
"unhandledRejection",
err=>{

console.error(
"Unhandled Rejection:",
err
);

});


process.on(
"uncaughtException",
err=>{

console.error(
"Uncaught Exception:",
err
);

process.exit(1);

});



// ========================================
// EXPORT
// ========================================

module.exports = app;