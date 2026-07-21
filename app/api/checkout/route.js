import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@/lib/supabase/server";


const stripe = new Stripe(
  process.env.STRIPE_SECRET_KEY
);



export async function POST(request) {

try {


const { productId } = await request.json();



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



const supabase = await createClient();




// Get product

const { data: product, error } = await supabase

.from("products")

.select(`
id,
title,
price,
image,
seller_id,
description
`)

.eq("id", productId)

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




// Create Stripe Checkout


const session = await stripe.checkout.sessions.create({



payment_method_types:[

"card"

],



mode:"payment",



line_items:[

{

price_data:{


currency:"cad",



product_data:{


name:product.title,


description:
product.description || "Halo Market Product",



images:

product.image
?
[product.image]
:
[]

},



unit_amount:

Math.round(
Number(product.price) * 100
),


},



quantity:1


}

],





metadata:{


productId:product.id,


sellerId:product.seller_id


},




success_url:

`${process.env.NEXT_PUBLIC_SITE_URL}/orders/success?session_id={CHECKOUT_SESSION_ID}`,




cancel_url:

`${process.env.NEXT_PUBLIC_SITE_URL}/checkout/cancel`



});





return NextResponse.json({

url:session.url

});





}catch(error){


console.error(
"Checkout Error:",
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