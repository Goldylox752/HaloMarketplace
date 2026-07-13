import { notFound } from "next/navigation";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";


async function getProduct(id) {

  const supabase = await createClient();


  const { data, error } = await supabase
    .from("products")
    .select(`
      *,
      profiles:seller_id(
        username,
        avatar,
        rating,
        location
      )
    `)
    .eq("id", id)
    .single();


  if(error || !data){
    return null;
  }


  return data;

}




function formatPrice(price){

return new Intl.NumberFormat("en-CA",{
style:"currency",
currency:"CAD"
}).format(price || 0);

}




export default async function ProductPage({params}){


const {id}=await params;


const product = await getProduct(id);



if(!product){

notFound();

}




return (

<main className="min-h-screen bg-gray-50 py-16 px-6">


<div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12">



{/* PRODUCT IMAGE */}

<div className="bg-white rounded-3xl shadow p-10">


{product.image ? (

<Image

src={product.image}

alt={product.title}

width={900}

height={700}

className="rounded-2xl object-cover w-full h-[500px]"

/>


):(


<div className="h-[500px] flex items-center justify-center text-8xl">

📦

</div>


)}



</div>





{/* DETAILS */}


<div className="bg-white rounded-3xl shadow p-10">


<h1 className="text-5xl font-bold">

{product.title}

</h1>




<p className="mt-5 text-3xl text-indigo-600 font-bold">

{formatPrice(product.price)}

</p>




<p className="mt-4 text-gray-500">

📍 {product.location || "Canada"}

</p>




<div className="mt-8">


<h2 className="text-2xl font-bold">

Description

</h2>



<p className="mt-3 text-gray-600 leading-relaxed">

{product.description || "No description available."}

</p>


</div>







{/* SELLER */}


<div className="mt-10 border-t pt-6">


<h2 className="font-bold text-xl">

Seller

</h2>



<div className="mt-4">


<p className="font-semibold text-lg">

{
product.profiles?.username ||
"Verified Seller"
}

</p>



<p className="text-gray-500">

⭐ {product.profiles?.rating || "5.0"}

</p>


</div>





<button className="mt-6 w-full bg-indigo-600 text-white py-4 rounded-xl text-lg font-bold hover:bg-indigo-700">

Message Seller

</button>




<button className="mt-4 w-full bg-black text-white py-4 rounded-xl text-lg font-bold hover:bg-gray-800">

Buy Now

</button>


</div>



</div>



</div>



</main>


)

}
