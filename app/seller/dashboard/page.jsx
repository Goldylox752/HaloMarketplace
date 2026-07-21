import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";


async function getSellerData(){


const supabase = await createClient();



const {
data:{
user
}

}= await supabase.auth.getUser();



if(!user){

redirect("/login");

}





const {data:products,error} = await supabase

.from("products")

.select(`

id,

title,

price,

image,

slug,

status,

created_at

`)

.eq(
"seller_id",
user.id
)

.order(
"created_at",
{
ascending:false
}
);



if(error){

console.error(error);

return {
user,
products:[]
};

}



return {

user,

products:products ?? []

};


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





export default async function SellerDashboard(){


const {

user,

products

}= await getSellerData();





return (

<main className="min-h-screen bg-gray-50 px-6 py-16">


<div className="mx-auto max-w-7xl">





{/* HEADER */}


<div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">


<div>

<h1 className="text-5xl font-black">

Seller Dashboard

</h1>


<p className="mt-3 text-gray-600">

Manage your Halo Market store and listings.

</p>


</div>




<Link

href="/sell"

className="rounded-xl bg-indigo-600 px-8 py-4 text-center font-bold text-white hover:bg-indigo-700"

>

+ Create Listing

</Link>



</div>








{/* STATS */}


<div className="mt-12 grid gap-6 md:grid-cols-4">



<div className="rounded-3xl bg-white p-8 shadow-sm">

<p className="text-gray-500">
Listings
</p>

<h2 className="mt-3 text-4xl font-black">

{products.length}

</h2>

</div>





<div className="rounded-3xl bg-white p-8 shadow-sm">

<p className="text-gray-500">
Sales
</p>

<h2 className="mt-3 text-4xl font-black">

0

</h2>

</div>





<div className="rounded-3xl bg-white p-8 shadow-sm">

<p className="text-gray-500">
Revenue
</p>

<h2 className="mt-3 text-4xl font-black">

$0

</h2>

</div>





<div className="rounded-3xl bg-white p-8 shadow-sm">

<p className="text-gray-500">
Messages
</p>

<h2 className="mt-3 text-4xl font-black">

0

</h2>

</div>



</div>








{/* QUICK LINKS */}


<div className="mt-12 grid gap-6 md:grid-cols-3">



<Link

href="/orders"

className="rounded-3xl bg-white p-8 shadow-sm hover:shadow-xl"

>

<h3 className="text-2xl font-black">

📦 Orders

</h3>


<p className="mt-3 text-gray-600">

Manage customer purchases.

</p>


</Link>




<Link

href="/messages"

className="rounded-3xl bg-white p-8 shadow-sm hover:shadow-xl"

>

<h3 className="text-2xl font-black">

💬 Messages

</h3>


<p className="mt-3 text-gray-600">

Talk with buyers.

</p>


</Link>





<Link

href="/support"

className="rounded-3xl bg-white p-8 shadow-sm hover:shadow-xl"

>

<h3 className="text-2xl font-black">

⚙️ Store Settings

</h3>


<p className="mt-3 text-gray-600">

Manage your seller account.

</p>


</Link>



</div>








{/* PRODUCTS */}


<section className="mt-16">


<div className="mb-8 flex justify-between items-center">


<h2 className="text-3xl font-black">

My Listings

</h2>


<Link

href="/sell"

className="font-bold text-indigo-600"

>

Add Product →

</Link>


</div>







{
products.length === 0 ? (


<div className="rounded-3xl bg-white p-16 text-center">


<div className="text-7xl">

🏪

</div>


<h3 className="mt-5 text-3xl font-black">

No Listings Yet

</h3>


<p className="mt-3 text-gray-600">

Create your first product and start selling.

</p>



</div>



):(



<div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">



{products.map((product)=>(


<div

key={product.id}

className="overflow-hidden rounded-3xl bg-white shadow-sm"

>



<div className="relative h-52 bg-gray-100">


{product.image ? (


<Image

src={product.image}

alt={product.title}

fill

className="object-cover"

/>


):(


<div className="flex h-full items-center justify-center text-6xl">

📦

</div>


)}



</div>





<div className="p-6">


<h3 className="font-black">

{product.title}

</h3>



<p className="mt-3 text-xl font-black text-indigo-600">

{formatPrice(product.price)}

</p>




<p className="mt-2 text-sm capitalize text-gray-500">

Status: {product.status || "active"}

</p>





<Link

href={`/product/${product.slug ?? product.id}`}

className="mt-5 block text-center font-bold text-indigo-600"

>

View Listing →

</Link>



</div>



</div>



))}



</div>



)

}




</section>




</div>


</main>

);


}