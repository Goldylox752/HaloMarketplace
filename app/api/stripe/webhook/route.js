import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@/lib/supabase/server";


const stripe = new Stripe(
  process.env.STRIPE_SECRET_KEY
);



export async function POST(request) {


const body = await request.text();


const signature =
request.headers.get(
"stripe-signature"
);



let event;



try {


event = stripe.webhooks.constructEvent(

body,

signature,

process.env.STRIPE_WEBHOOK_SECRET

);


} catch(error){


console.error(
"Webhook verification failed:",
error.message
);


return new NextResponse(
"Webhook Error",
{
status:400
}
);


}





if(event.type === "checkout.session.completed"){



const session = event.data.object;



const productId =
session.metadata.productId;



const sellerId =
session.metadata.sellerId;



const amount =
session.amount_total / 100;




const supabase = await createClient();



// Get customer

const customerEmail =
session.customer_details?.email;




// Find buyer

const {data:buyer} = await supabase

.from("profiles")

.select("id")

.eq(
"email",
customerEmail
)

.single();





// Create order


await supabase

.from("orders")

.insert({

buyer_id:
buyer?.id || null,


seller_id:
sellerId,


product_id:
productId,


amount,


status:"paid"


});






// Mark product sold


await supabase

.from("products")

.update({

status:"sold"

})

.eq(
"id",
productId
);



}





return NextResponse.json({

received:true

});


}