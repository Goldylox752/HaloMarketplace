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


    event =
      stripe.webhooks.constructEvent(

        body,

        signature,

        process.env.STRIPE_WEBHOOK_SECRET

      );


  } catch(error){


    console.error(
      "Stripe webhook verification failed:",
      error.message
    );


    return new NextResponse(
      "Webhook Error",
      {
        status:400
      }
    );

  }






  const supabase =
    await createClient();





  if(
    event.type ===
    "checkout.session.completed"
  ){



    const session =
      event.data.object;





    const productId =
      session.metadata?.productId;



    const sellerId =
      session.metadata?.sellerId;



    const buyerId =
      session.metadata?.buyerId;




    const amount =
      session.amount_total / 100;





    if(
      !productId ||
      !sellerId
    ){

      return NextResponse.json({

        error:"Missing metadata"

      },
      {
        status:400
      });

    }







    // Prevent duplicate orders

    const {
      data:existingOrder
    } = await supabase

    .from("orders")

    .select("id")

    .eq(
      "payment_id",
      session.id
    )

    .maybeSingle();






    if(existingOrder){


      return NextResponse.json({

        received:true

      });


    }








    // Marketplace fee 8%

    const platformFee =
      Number(
        (amount * 0.08)
        .toFixed(2)
      );



    const sellerAmount =
      amount - platformFee;









    // Create order

    const {
      error:orderError
    } = await supabase

    .from("orders")

    .insert({


      buyer_id:
        buyerId || null,


      seller_id:
        sellerId,


      product_id:
        productId,


      amount,


      platform_fee:
        platformFee,


      seller_amount:
        sellerAmount,


      payment_status:
        "paid",


      status:
        "processing",


      payment_id:
        session.id


    });






    if(orderError){


      console.error(
        "Order creation failed:",
        orderError
      );


    }








    // Lock product

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





  if(
    event.type ===
    "checkout.session.expired"
  ){



    const session =
      event.data.object;



    console.log(
      "Expired checkout:",
      session.id
    );


  }






  return NextResponse.json({

    received:true

  });


}