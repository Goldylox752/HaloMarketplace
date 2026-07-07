// ========================================
// Halo Marketplace
// routes/authRoutes.js
// ========================================


const express = require("express");

const router = express.Router();



const {

register,

login,

verifyEmail,

resendVerification,

forgotPassword,

resetPassword


} = require("../controllers/authController");





// ========================================
// REGISTER
// POST /api/v1/auth/register
// ========================================


router.post(

"/register",

register

);







// ========================================
// LOGIN
// POST /api/v1/auth/login
// ========================================


router.post(

"/login",

login

);







// ========================================
// VERIFY EMAIL
// GET /api/v1/auth/verify/:token
// ========================================


router.get(

"/verify/:token",

verifyEmail

);







// ========================================
// RESEND VERIFICATION
// POST /api/v1/auth/resend-verification
// ========================================


router.post(

"/resend-verification",

resendVerification

);







// ========================================
// FORGOT PASSWORD
// POST /api/v1/auth/forgot-password
// ========================================


router.post(

"/forgot-password",

forgotPassword

);







// ========================================
// RESET PASSWORD
// POST /api/v1/auth/reset-password/:token
// ========================================


router.post(

"/reset-password/:token",

resetPassword

);







module.exports = router;