// ========================================
// Halo Marketplace
// routes/authRoutes.js
// ========================================


const router = require("express").Router();


const {

register,
login

} = require("../controllers/authController");



// CREATE ACCOUNT

router.post(

"/register",

register

);



// LOGIN

router.post(

"/login",

login

);



module.exports = router;