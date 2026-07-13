import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@/lib/supabase/server";


const stripe = new Stripe(
process.env.STRIPE_SECRET_KEY
);



export async function POST(request){


try{


const body = await request.json();


const productId = body.productId;



const supabase = await createClient();




const {

data:{
user

}

}=await supabase.auth.getUser();



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





const {

data:product,

error

}=await supabase

.from("products")

.select("*")

.eq("id",productId)

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







const session = await stripe.checkout.sessions.create({


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


description:product.description


},


unit_amount:

Math.round(product.price * 100)


},


quantity:1


}

],





success_url:

`${process.env.NEXT_PUBLIC_SITE_URL}/orders?success=true`,



cancel_url:

`${process.env.NEXT_PUBLIC_SITE_URL}/products/${product.id}`,





metadata:{


product_id:product.id,


buyer_id:user.id,


seller_id:product.seller_id


}



});





return NextResponse.json({

url:session.url

});





}catch(error){


console.log(error);



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
