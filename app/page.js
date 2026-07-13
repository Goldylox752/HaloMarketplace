import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";


async function getProducts() {

  const supabase = await createClient();


  const { data: products } = await supabase
    .from("products")
    .select("*")
    .order("created_at", {
      ascending:false
    })
    .limit(8);


  return products ?? [];

}



function formatPrice(price:number){

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



return (

<main className="min-h-screen bg-gray-50">


{/* HERO */}

<section className="bg-white py-20 px-6">


<div className="max-w-7xl mx-auto text-center">


<h1 className="text-5xl md:text-6xl font-bold">

Buy & Sell Across Canada

</h1>


<p className="mt-6 text-xl text-gray-600 max-w-2xl mx-auto">

Halo Marketplace connects buyers and sellers with a simple, secure shopping experience.

</p>



<div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">


<Link

href="/products"

className="bg-black text-white px-8 py-4 rounded-xl font-bold"

>

Browse Products

</Link>



<Link

href="/sell"

className="bg-indigo-600 text-white px-8 py-4 rounded-xl font-bold"

>

Start Selling

</Link>


</div>


</div>


</section>





{/* CATEGORIES */}

<section className="py-12 px-6">


<div className="max-w-7xl mx-auto">


<h2 className="text-3xl font-bold mb-8">

Shop Categories

</h2>



<div className="grid grid-cols-2 md:grid-cols-4 gap-6">


{[
["🚗","Vehicles"],
["📱","Electronics"],
["🏠","Home"],
["👕","Fashion"],
["🎮","Gaming"],
["🛠","Tools"],
["⚽","Sports"],
["💼","Services"]
].map(([icon,name])=>(


<Link

key={name}

href={`/products?category=${name}`}

className="bg-white rounded-3xl shadow p-8 text-center hover:shadow-xl"

>


<div className="text-4xl">

{icon}

</div>


<p className="mt-3 font-bold">

{name}

</p>


</Link>


))}


</div>


</div>


</section>






{/* FEATURED PRODUCTS */}

<section className="px-6 py-12">


<div className="max-w-7xl mx-auto">


<div className="flex justify-between items-center mb-8">


<h2 className="text-3xl font-bold">

Featured Listings

</h2>



<Link

href="/products"

className="text-indigo-600 font-bold"

>

View All →

</Link>


</div>





{
products.length === 0 ?


<div className="bg-white rounded-3xl p-10">

No products listed yet.

<Link

href="/sell"

className="block mt-4 text-indigo-600 font-bold"

>

Become the first seller

</Link>


</div>



:


<div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">


{
products.map((product)=>(


<Link

key={product.id}

href={`/products/${product.id}`}

className="bg-white rounded-3xl shadow overflow-hidden hover:shadow-xl"

>


<div className="h-52 bg-gray-100">


{
product.image ?


<Image

src={product.image}

alt={product.title}

width={400}

height={300}

className="w-full h-full object-cover"

/>



:


<div className="h-full flex items-center justify-center text-6xl">

📦

</div>


}


</div>




<div className="p-5">


<h3 className="font-bold">

{product.title}

</h3>



<p className="text-indigo-600 font-bold mt-2">

{formatPrice(product.price)}

</p>



<p className="text-gray-500 text-sm mt-2">

📍 {product.location}

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

<section className="py-16 px-6">


<div className="max-w-5xl mx-auto bg-black text-white rounded-3xl p-10 text-center">


<h2 className="text-4xl font-bold">

Open Your Halo Store

</h2>


<p className="mt-4 text-gray-300">

Start selling products and reach buyers across Canada.

</p>



<Link

href="/sell"

className="inline-block mt-8 bg-indigo-600 px-8 py-4 rounded-xl font-bold"

>

Start Selling

</Link>


</div>


</section>


</main>

);

}