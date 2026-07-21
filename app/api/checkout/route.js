import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@/lib/supabase/server";



const stripe = new Stripe(
  process.env.STRIPE_SECRET_KEY,
  {
    apiVersion: "2025-06-30.basil",
  }
);





export async function POST(request){


try{


const {
productId
}= await request.json();




if(!productId){

return NextResponse.json(
{
error:"Product ID required"
},
{
status:400
}
);

}





const supabase =
await createClient();





// Check user

const {
data:{
user
}

}= await supabase.auth.getUser();





if(!user){

return NextResponse.json(
{
error:"Login required"
},
{
status:401
}
);

}







// Get product

const {
data:product,
error

}= await supabase

.from("products")

.select(`
id,
title,
price,
image,
description,
seller_id,
status
`)

.eq(
"id",
productId
)

.single();







if(error || !product){

return NextResponse.json(
{
error:"Product not found"
},
{
status:404
}
);

}







// Check availability

if(product.status !== "active"){


return NextResponse.json(
{
error:"This item is unavailable"
},
{
status:400
}
);


}







// Prevent seller purchase

if(product.seller_id === user.id){


return NextResponse.json(
{
error:"You cannot buy your own product"
},
{
status:400
}
);


}







// Create pending order


const {
data:order,
error:orderError

}= await supabase

.from("orders")

.insert({

buyer_id:user.id,

seller_id:product.seller_id,

product_id:product.id,

amount:Number(product.price),

payment_status:"unpaid",

status:"pending"

})

.select()

.single();







if(orderError){


console.error(
orderError
);


return NextResponse.json(
{
error:"Order creation failed"
},
{
status:500
}
);


}







// Stripe checkout


const session =

await stripe.checkout.sessions.create({



mode:"payment",



payment_method_types:[

"card"

],





line_items:[

{

price_data:{


currency:"cad",



product_data:{


name:product.title,


description:
product.description ||
"Halo Marketplace protected purchase",



images:
product.image
?
[
product.image
]
:
[]


},





unit_amount:

Math.round(
Number(product.price) * 100
)


},




quantity:1


}

],






metadata:{


orderId:
order.id,


productId:
product.id,


buyerId:
user.id,


sellerId:
product.seller_id


},





success_url:

`${process.env.NEXT_PUBLIC_SITE_URL}/orders/${order.id}?success=true`,





cancel_url:

`${process.env.NEXT_PUBLIC_SITE_URL}/product/${product.id}`



});







// Save stripe session


await supabase

.from("orders")

.update({

stripe_session_id:
session.id

})

.eq(
"id",
order.id
);







return NextResponse.json({

url:
session.url

});






}catch(error){


console.error(
"Stripe Checkout Error:",
error
);



return NextResponse.json(

{
error:"Checkout failed"
},

{
status:500
}

);


}


}