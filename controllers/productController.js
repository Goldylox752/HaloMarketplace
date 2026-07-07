// ========================================
// Halo Marketplace
// Product Controller
// ========================================


const prisma = require("../config/prisma");




// GET ALL PRODUCTS

exports.getProducts = async(req,res)=>{


try{


const products =

await prisma.product.findMany({

where:{
status:"active"
},


include:{

vendor:true

},


orderBy:{

createdAt:"desc"

}


});



res.json({

success:true,

products

});


}

catch(error){


res.status(500).json({

success:false,

message:error.message

});


}


};








// GET SINGLE PRODUCT

exports.getProduct = async(req,res)=>{


try{


const product =

await prisma.product.findUnique({

where:{

id:req.params.id

},


include:{

vendor:true

}


});



res.json({

success:true,

product

});


}

catch(error){


res.status(500).json({

success:false

});


}


};








// CREATE PRODUCT

exports.createProduct = async(req,res)=>{


try{


const {


title,

description,

price,

quantity,

categoryId,

imageUrl


}=req.body;





const product =

await prisma.product.create({

data:{


title,

description,


price:Number(price),


quantity:Number(quantity),


imageUrl,


categoryId,


vendorId:req.user.vendorId


}


});





res.status(201).json({

success:true,

product

});


}

catch(error){


console.error(error);


res.status(500).json({

success:false,

message:"Product creation failed"

});


}


};









// SELLER PRODUCTS

exports.getSellerProducts = async(req,res)=>{


const products =

await prisma.product.findMany({

where:{


vendorId:req.user.vendorId


}


});



res.json({

success:true,

products

});


};









// UPDATE PRODUCT

exports.updateProduct = async(req,res)=>{


const product =

await prisma.product.update({

where:{

id:req.params.id

},


data:req.body


});



res.json({

success:true,

product

});


};








// DELETE PRODUCT

exports.deleteProduct = async(req,res)=>{


await prisma.product.delete({

where:{

id:req.params.id

}


});



res.json({

success:true

});


};