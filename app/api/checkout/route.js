import { NextResponse } from "next/server";
import Stripe from "stripe";


const stripe = new Stripe(
process.env.STRIPE_SECRET_KEY
);



export async function POST(request){


const {productId} = await request.json();



/*
Later:
Fetch product from Supabase
Get price
Get seller information
*/


const session = await stripe.checkout.sessions.create({


payment_method_types:[

"card"

],



line_items:[

{

price_data:{

currency:"cad",

product_data:{

name:"Halo Market Product"

},

unit_amount:1000,

},


quantity:1,


}

],



mode:"payment",



success_url:

`${process.env.NEXT_PUBLIC_SITE_URL}/orders/success`,



cancel_url:

`${process.env.NEXT_PUBLIC_SITE_URL}/checkout/cancel`,



metadata:{

productId

}


});




return NextResponse.json({

url:session.url

});


}