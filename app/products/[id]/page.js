import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

import FavoriteButton from "@/components/FavoriteButton";
import CheckoutButton from "@/components/CheckoutButton";



async function getProduct(id){


const supabase = await createClient();



const {

data,

error

}=await supabase

.from("products")

.select(`

*,

profiles:seller_id(

username,

avatar,

location,

rating

)

`)

.eq("id",id)

.single();





if(error || !data){

return null;

}



return data;


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







export default async function ProductPage({params}){


const {id}=await params;



const product = await getProduct(id);





if(!product){

notFound();

}







return (

<main className="min-h-screen bg-gray-50 py-16 px-6">



<div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12">





{/* IMAGE */}



<div className="bg-white rounded-3xl shadow overflow-hidden">



{

product.image ? (



<Image

src={product.image}

alt={product.title}

width={900}

height={900}

className="w-full h-[600px] object-cover"

/>



):(



<div className="h-[600px] flex items-center justify-center text-8xl">

📦

</div>



)

}



</div>










{/* DETAILS */}



<div className="bg-white rounded-3xl shadow p-10">






<p className="text-indigo-600 font-bold">

{product.category}

</p>






<h1 className="text-5xl font-black mt-3">

{product.title}

</h1>






<p className="text-4xl font-black text-indigo-600 mt-6">

{formatPrice(product.price)}

</p>








<p className="text-gray-600 text-lg mt-6">

{product.description}

</p>









<div className="mt-8 border rounded-2xl p-6">



<h2 className="font-bold text-xl">

Seller

</h2>




<div className="mt-3">



<p className="font-semibold">

{product.profiles?.username || "Halo Seller"}

</p>



<p className="text-gray-500">

📍 {product.location || product.profiles?.location || "Canada"}

</p>




<p className="mt-2">

⭐ {product.profiles?.rating || "5.0"}

</p>



</div>



</div>









<div className="mt-8 space-y-4">



<CheckoutButton

productId={product.id}

/>





<FavoriteButton

productId={product.id}

/>







<Link

href={`/messages?seller=${product.seller_id}&product=${product.id}`}

className="block text-center w-full border py-4 rounded-xl font-bold hover:bg-gray-100"

>

💬 Message Seller

</Link>





</div>






</div>





</div>





</main>

)


}
