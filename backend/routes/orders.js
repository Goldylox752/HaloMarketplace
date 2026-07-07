// ========================================
// Halo Marketplace
// routes/orderRoutes.js
// ========================================


const router = require("express").Router();


const prisma = require("../config/prisma");

const {
    protect
} = require("../middleware/auth");





// ========================================
// CREATE ORDER
// POST /api/v1/orders
// ========================================


router.post(
"/",
protect,

async(req,res)=>{


try{


const {

items,
vendorId

} = req.body;



if(!items || items.length === 0){

return res.status(400).json({

success:false,

message:"Cart is empty"

});

}





let total = 0;



items.forEach(item=>{


total +=

Number(item.price) *

Number(item.qty);


});







const order = await prisma.order.create({

data:{


buyerId:req.user.id,


vendorId,


total,


paymentStatus:"pending",


orderStatus:"processing",


items:{


create:

items.map(item=>({


productId:item.productId,


quantity:item.qty,


price:item.price


}))


}


},



include:{


items:true


}


});






res.status(201).json({

success:true,

order


});




}

catch(error){


console.error(
"Create order error:",
error
);



res.status(500).json({

success:false,

message:"Unable to create order"

});


}



});







// ========================================
// GET USER ORDERS
// GET /api/v1/orders
// ========================================


router.get(
"/",
protect,

async(req,res)=>{


try{


const orders =

await prisma.order.findMany({

where:{


buyerId:req.user.id


},


include:{


items:true


},


orderBy:{


createdAt:"desc"


}


});



res.json({

success:true,

orders


});



}

catch(error){


res.status(500).json({

success:false

});


}



});







module.exports = router;