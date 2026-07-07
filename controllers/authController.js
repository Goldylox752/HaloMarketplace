// ========================================
// Halo Marketplace
// controllers/authController.js
// ========================================


const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");


const prisma = require("../config/prisma");





// ========================================
// REGISTER
// ========================================


exports.register = async(req,res)=>{


try{


const {

name,

email,

password


}=req.body;




if(!name || !email || !password){


return res.status(400).json({

success:false,

message:"All fields required"

});


}





const existingUser =

await prisma.user.findUnique({

where:{

email

}

});





if(existingUser){


return res.status(400).json({

success:false,

message:"Email already registered"

});


}





const hashedPassword =

await bcrypt.hash(

password,

12

);






const user =

await prisma.user.create({

data:{


name,


email,


password:hashedPassword,


role:"USER"


}

});






res.status(201).json({

success:true,

message:"Account created",

user:{


id:user.id,

name:user.name,

email:user.email


}


});



}

catch(error){


console.error(error);



res.status(500).json({

success:false,

message:"Registration failed"

});


}



};









// ========================================
// LOGIN
// ========================================


exports.login = async(req,res)=>{


try{


const {

email,

password


}=req.body;





const user =

await prisma.user.findUnique({

where:{

email

}

});





if(!user){


return res.status(401).json({

success:false,

message:"Invalid login"

});


}





const validPassword =

await bcrypt.compare(

password,

user.password

);





if(!validPassword){


return res.status(401).json({

success:false,

message:"Invalid login"

});


}






const token =

jwt.sign(

{


id:user.id,

role:user.role


},


process.env.JWT_SECRET,


{

expiresIn:"7d"

}


);







res.json({

success:true,

token,


user:{


id:user.id,

name:user.name,

email:user.email,

role:user.role


}


});



}


catch(error){


res.status(500).json({

success:false

});


}


};