import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";


async function getProducts() {

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
      ascending: false
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

Halo Marketplace connects buyers and sellers
with a simple, secure, and modern shopping
experience.

</p>




<div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">


<Link

href="/products"

className="rounded-xl bg-black px-8 py-4 font-bold text-white transition hover:bg-gray-800"

>

Browse Products

</Link>




<Link

href="/sell"

className="rounded-xl bg-indigo-600 px-8 py-4 font-bold text-white transition hover:bg-indigo-700"

>

Start Selling

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








{/* FEATURED PRODUCTS */}



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







{

products.length === 0 ?


<div className="rounded-3xl bg-white p-10 text-center">


<h3 className="text-xl font-bold">

No products yet

</h3>



<Link

href="/sell"

className="mt-5 inline-block font-bold text-indigo-600"

>

Create the first listing →

</Link>


</div>



:


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

product.image ?


<Image

src={product.image}

alt={product.title}

fill

sizes="(max-width:768px) 100vw, 300px"

className="object-cover"

/>


:


<div className="flex h-full items-center justify-center text-6xl">

📦

</div>


}


</div>






<div className="p-6">


<h3 className="font-bold text-lg">

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

Create listings, manage products,
and reach buyers across Canada.

</p>




<Link

href="/sell"

className="mt-8 inline-block rounded-xl bg-indigo-600 px-8 py-4 font-bold transition hover:bg-indigo-700"

>

Start Selling

</Link>


</div>


</section>






</main>

);


}