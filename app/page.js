import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";


async function getProducts(){

  const supabase = await createClient();


  const { data: products, error } = await supabase
    .from("products")
    .select(`
      id,
      title,
      price,
      image,
      location,
      slug,
      created_at
    `)
    .order("created_at", {
      ascending:false
    })
    .limit(8);



  if(error){

    console.error(error);

    return [];

  }


  return products ?? [];

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







export default async function HomePage(){


const products = await getProducts();



const categories = [

["🚗","Vehicles"],
["📱","Electronics"],
["🏠","Home"],
["👕","Fashion"],
["🎮","Gaming"],
["🛠","Tools"],
["⚽","Sports"],
["💼","Services"]

];





return (

<main className="min-h-screen bg-gray-50">






{/* HERO */}


<section className="bg-white px-6 py-24">


<div className="mx-auto max-w-7xl text-center">



<h1 className="text-5xl font-black tracking-tight md:text-6xl">

Buy & Sell Across Canada

</h1>



<p className="mx-auto mt-6 max-w-3xl text-xl text-gray-600">

Halo Market is a modern marketplace connecting
buyers and sellers with a simple, secure,
and affordable experience.

</p>






<div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">


<Link

href="/products"

className="rounded-xl bg-black px-8 py-4 font-bold text-white transition hover:bg-gray-800"

>

Browse Products

</Link>





<Link

href="/seller/register"

className="rounded-xl bg-indigo-600 px-8 py-4 font-bold text-white transition hover:bg-indigo-700"

>

Create Seller Account

</Link>






<Link

href="/support"

className="rounded-xl border border-gray-300 bg-white px-8 py-4 font-bold text-gray-900 transition hover:bg-gray-100"

>

❤️ Support Halo Market

</Link>



</div>



</div>


</section>








{/* CATEGORIES */}


<section className="px-6 py-16">


<div className="mx-auto max-w-7xl">



<h2 className="mb-8 text-3xl font-black">

Shop Categories

</h2>




<div className="grid grid-cols-2 gap-6 md:grid-cols-4">



{
categories.map(([icon,name])=>(


<Link

key={name}

href={`/products?category=${name}`}

className="rounded-3xl bg-white p-8 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-xl"

>


<div className="text-5xl">

{icon}

</div>




<h3 className="mt-4 font-bold">

{name}

</h3>



</Link>


))

}



</div>


</div>


</section>








{/* FEATURED LISTINGS */}


<section className="px-6 py-16">


<div className="mx-auto max-w-7xl">



<div className="mb-10 flex items-center justify-between">


<h2 className="text-3xl font-black">

Featured Listings

</h2>



<Link

href="/products"

className="font-bold text-indigo-600"

>

View All →

</Link>



</div>
{/* PRODUCTS */}

{
products.length === 0 ? (

<div className="rounded-3xl bg-white p-10 text-center">


<h3 className="text-xl font-bold">

No listings yet

</h3>



<p className="mt-3 text-gray-600">

Be the first person to create a listing on Halo Market.

</p>




<Link

href="/seller/register"

className="mt-6 inline-block rounded-xl bg-indigo-600 px-8 py-4 font-bold text-white"

>

Create Seller Account →

</Link>


</div>


) : (



<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">


{

products.map((product)=>(


<Link

key={product.id}

href={`/product/${product.slug ?? product.id}`}

className="overflow-hidden rounded-3xl bg-white shadow-sm transition hover:-translate-y-2 hover:shadow-xl"

>



<div className="relative h-56 bg-gray-100">


{

product.image ? (


<Image

src={product.image}

alt={product.title}

fill

sizes="(max-width:768px) 100vw,300px"

className="object-cover"

/>


) : (


<div className="flex h-full items-center justify-center text-6xl">

📦

</div>


)


}



</div>






<div className="p-6">


<h3 className="text-lg font-bold">

{product.title}

</h3>




<p className="mt-3 text-xl font-black text-indigo-600">

{formatPrice(product.price)}

</p>




<p className="mt-2 text-sm text-gray-500">

📍 {product.location || "Canada"}

</p>


</div>



</Link>


))


}



</div>


)


}




</div>


</section>







{/* SELLER CTA */}


<section className="px-6 py-20">


<div className="mx-auto max-w-5xl rounded-3xl bg-black p-12 text-center text-white">



<h2 className="text-4xl font-black">

Open Your Halo Store

</h2>



<p className="mt-5 text-lg text-gray-300">

Create listings, sell products,
and reach buyers across Canada.

</p>




<div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">


<Link

href="/seller/register"

className="rounded-xl bg-indigo-600 px-8 py-4 font-bold hover:bg-indigo-700"

>

Become a Seller →

</Link>




<Link

href="/support"

className="rounded-xl border border-white px-8 py-4 font-bold hover:bg-white hover:text-black"

>

Support Halo Market ❤️

</Link>


</div>



</div>


</section>







{/* SUPPORT FREE MARKET CTA */}


<section className="px-6 pb-20">


<div className="mx-auto max-w-5xl rounded-3xl bg-indigo-600 p-12 text-center text-white">


<h2 className="text-4xl font-black">

Help Keep Halo Market Free

</h2>



<p className="mx-auto mt-5 max-w-2xl text-lg text-indigo-100">

Halo Market is built for everyone.
Your support helps cover hosting,
development, security, and future features.

</p>



<Link

href="/support"

className="mt-8 inline-block rounded-xl bg-white px-8 py-4 font-bold text-indigo-600"

>

Donate & Support →

</Link>



</div>


</section>







</main>

);

}