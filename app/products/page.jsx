import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";


async function getProducts(){

  const supabase = await createClient();


  const {data: products, error} = await supabase
    .from("products")
    .select(`
      id,
      title,
      price,
      image,
      location,
      slug,
      category,
      created_at
    `)
    .order("created_at", {
      ascending:false
    });



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




export default async function ProductsPage(){


const products = await getProducts();



return (

<main className="min-h-screen bg-gray-50 px-6 py-16">


<div className="mx-auto max-w-7xl">



{/* HEADER */}

<div className="mb-12">


<h1 className="text-5xl font-black">

Marketplace

</h1>


<p className="mt-4 text-lg text-gray-600">

Browse products from sellers across Canada.

</p>


</div>





{/* SEARCH / FILTER AREA */}

<div className="mb-10 rounded-3xl bg-white p-6 shadow-sm">


<div className="grid gap-4 md:grid-cols-3">


<input

placeholder="Search products..."

className="rounded-xl border px-5 py-3 outline-none"

 />



<select

className="rounded-xl border px-5 py-3"

>

<option>
All Categories
</option>

<option>
Electronics
</option>

<option>
Vehicles
</option>

<option>
Home
</option>

<option>
Fashion
</option>

</select>



<select

className="rounded-xl border px-5 py-3"

>

<option>
Location
</option>

<option>
Alberta
</option>

<option>
Ontario
</option>

<option>
British Columbia
</option>

</select>


</div>


</div>






{/* PRODUCTS */}


{products.length === 0 ? (


<div className="rounded-3xl bg-white p-16 text-center">


<div className="text-7xl">
📦
</div>


<h2 className="mt-6 text-3xl font-black">

No Products Found

</h2>


<p className="mt-3 text-gray-600">

Be the first seller on Halo Market.

</p>


<Link

href="/seller/register"

className="mt-8 inline-block rounded-xl bg-indigo-600 px-8 py-4 font-bold text-white"

>

Create Listing

</Link>


</div>


):(



<div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">


{products.map((product)=>(


<Link

key={product.id}

href={`/product/${product.slug ?? product.id}`}

className="overflow-hidden rounded-3xl bg-white shadow-sm transition hover:-translate-y-2 hover:shadow-xl"

>


<div className="relative h-60 bg-gray-100">


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


<h2 className="line-clamp-2 text-xl font-bold">

{product.title}

</h2>



<p className="mt-3 text-2xl font-black text-indigo-600">

{formatPrice(product.price)}

</p>



<p className="mt-2 text-sm text-gray-500">

📍 {product.location || "Canada"}

</p>



<p className="mt-2 text-sm text-gray-500">

🏷️ {product.category || "General"}

</p>


</div>



</Link>


))}


</div>


)}


</div>


</main>

);

}