// ========================================
// Halo Marketplace
// routes/paymentRoutes.js
// Stripe Checkout
// ========================================


const router = require("express").Router();

const stripe = require("../config/stripe");

const prisma = require("../config/prisma");

const {
    protect
} = require("../middleware/auth");





// ========================================
// CREATE CHECKOUT SESSION
// POST /api/v1/payments/create-checkout
// ========================================


router.post(
"/create-checkout",

protect,


async(req,res)=>{


try{


const {

orderId

} = req.body;





const order = await prisma.order.findUnique({

where:{
id:orderId
},


include:{

items:true

}


});





if(!order){


return res.status(404).json({

success:false,

message:"Order not found"

});


}





const session =

await stripe.checkout.sessions.create({



payment_method_types:[

"card"

],




mode:"payment",





line_items:

order.items.map(item=>({


price_data:{


currency:"cad",


product_data:{


name:
`Product ${item.productId}`


},


unit_amount:

Math.round(
item.price * 100
)


},


quantity:item.quantity


})),





metadata:{


orderId:order.id


},





success_url:

`${process.env.FRONTEND_URL}/checkout/success.html?order=${order.id}`,




cancel_url:

`${process.env.FRONTEND_URL}/checkout/cancel.html`



});








await prisma.order.update({

where:{

id:order.id

},


data:{


stripeSessionId:

session.id


}


});






res.json({

success:true,

checkoutUrl:

session.url


});




}

catch(error){


console.error(

"Stripe checkout error",

error

);



res.status(500).json({

success:false,

message:"Payment creation failed"

});


}



});






// ========================================
// SELLER PAYOUT STATUS
// GET /api/v1/payments/status/:orderId
// ========================================


router.get(

"/status/:orderId",

protect,


async(req,res)=>{


const order =

await prisma.order.findUnique({

where:{

id:req.params.orderId

}


});



res.json({

success:true,

status:

order?.paymentStatus || "unknown"


});


}

);






module.exports = router;