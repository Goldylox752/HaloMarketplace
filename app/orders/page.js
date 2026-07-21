import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";



async function getOrders(){


const supabase = await createClient();



const {
data:{
user
}
}= await supabase.auth.getUser();



if(!user){

redirect("/login");

}




const {data:orders,error}=await supabase

.from("orders")

.select(`

id,

amount,

status,

created_at,

buyer_id,

seller_id,

products(

id,

slug,

title,

image,

location,

price

)

`)

.or(
`buyer_id.eq.${user.id},seller_id.eq.${user.id}`
)

.order(
"created_at",
{
ascending:false
}
);





if(error){

console.error(error);

return [];

}



return orders ?? [];

}





function formatPrice(price){

return new Intl.NumberFormat(

"en-CA",

{

style:"currency",

currency:"CAD"

}

).format(price || 0);

}




function formatDate(date){


return new Date(date)

.toLocaleDateString(
"en-CA",
{
year:"numeric",
month:"long",
day:"numeric"
}
);

}





export default async function OrdersPage(){


const orders = await getOrders();




return (

<main className="min-h-screen bg-gray-50 px-6 py-16">


<div className="mx-auto max-w-7xl">



<div className="mb-10">


<h1 className="text-5xl font-black">

Orders

</h1>


<p className="mt-3 text-lg text-gray-600">

Track purchases and sales from your Halo Market account.

</p>


</div>







{
orders.length === 0 ? (


<div className="rounded-3xl bg-white p-16 text-center shadow-sm">


<div className="text-7xl">

📦

</div>



<h2 className="mt-6 text-3xl font-black">

No Orders Yet

</h2>



<p className="mt-3 text-gray-600">

Your purchases and sales will appear here.

</p>




<Link

href="/products"

className="mt-8 inline-block rounded-xl bg-indigo-600 px-8 py-4 font-bold text-white hover:bg-indigo-700"

>

Browse Marketplace

</Link>



</div>



):(





<div className="grid gap-8 lg:grid-cols-2">





{orders.map((order)=>(


<div

key={order.id}

className="rounded-3xl bg-white p-6 shadow-sm transition hover:shadow-xl"

>




<div className="flex gap-5">





<div className="relative h-32 w-32 overflow-hidden rounded-2xl bg-gray-100">


{

order.products?.image ? (


<Image

src={order.products.image}

alt={order.products.title}

fill

className="object-cover"

/>



):(


<div className="flex h-full items-center justify-center text-5xl">

📦

</div>


)


}



</div>








<div className="flex-1">


<h2 className="text-xl font-black">

{order.products?.title || "Product"}

</h2>



<p className="mt-2 text-2xl font-black text-indigo-600">

{formatPrice(order.amount)}

</p>



<p className="mt-2 text-gray-500">

📍 {order.products?.location || "Canada"}

</p>


</div>



</div>









<div className="mt-6 flex items-center justify-between border-t pt-5">


<div>


<p className="font-bold">

Status

</p>


<span className="mt-1 inline-block rounded-full bg-green-100 px-3 py-1 text-sm font-bold text-green-700">

{order.status}

</span>



<p className="mt-2 text-sm text-gray-500">

{formatDate(order.created_at)}

</p>


</div>





{order.products?.slug && (


<Link

href={`/product/${order.products.slug}`}

className="font-bold text-indigo-600 hover:text-indigo-700"

>

View Product →

</Link>


)}



</div>






</div>


))}



</div>



)


}



</div>


</main>

);


}