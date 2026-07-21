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
      category
    `)
    .order("created_at", {
      ascending:false
    });


  if(error){

    console.log(error);

    return [];

  }


  return products || [];

}





export const metadata = {

title:"Browse Listings | Halo Marketplace",

description:
"Find products and deals from local sellers on Halo Marketplace."

};





export default async function BrowsePage(){


const products = await getProducts();



return (

<main className="min-h-screen bg-gray-50">



{/* HERO */}

<section className="bg-black text-white py-16 px-6">


<div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between gap-8">


<div>

<h1 className="text-5xl font-bold">
Browse Halo Marketplace
</h1>


<p className="mt-4 text-gray-300 text-lg">

Discover great deals from sellers near you.

</p>


</div>



<Link

href="/sell"

className="
bg-white
text-black
px-6
py-3
rounded-xl
font-semibold
h-fit
"

>

Sell Something

</Link>



</div>


</section>






{/* SEARCH */}

<section className="max-w-6xl mx-auto px-6 py-10">


<div className="
bg-white
rounded-2xl
shadow
p-6
grid
md:grid-cols-3
gap-4
">


<input

placeholder="Search products..."

className="
border
rounded-xl
px-5
py-3
"

/>



<select className="
border
rounded-xl
px-5
py-3
">


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
Gaming
</option>

<option>
Other
</option>


</select>




<select className="
border
rounded-xl
px-5
py-3
">


<option>
All Locations
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


</section>







{/* RESULTS */}

<section className="
max-w-6xl
mx-auto
px-6
pb-20
">


<div className="
flex
justify-between
items-center
mb-8
">


<h2 className="text-3xl font-bold">

Latest Listings ({products.length})

</h2>


</div>





{
products.length > 0 ? (


<div className="
grid
grid-cols-1
sm:grid-cols-2
lg:grid-cols-4
gap-6
">


{
products.map((product)=>(


<Link

key={product.id}

href={`/product/${product.slug}`}

className="
bg-white
rounded-2xl
overflow-hidden
shadow-sm
hover:shadow-xl
transition
"


>


<div className="
relative
h-56
bg-gray-100
">


{
product.image ? (

<Image

src={product.image}

alt={product.title}

fill

sizes="(max-width:768px)100vw,25vw"

className="object-cover"

/>


):(


<div className="
flex
items-center
justify-center
h-full
text-gray-400
">

No Image

</div>


)

}


</div>






<div className="p-5">


<h3 className="
font-bold
text-lg
truncate
">

{product.title}

</h3>



<div className="
flex
justify-between
mt-3
">


<p className="
font-bold
text-xl
">

${Number(product.price).toLocaleString()}

</p>



</div>




<p className="
text-gray-500
text-sm
mt-2
">

📍 {product.location}

</p>



{
product.category && (

<span className="
inline-block
mt-4
bg-gray-100
rounded-full
px-3
py-1
text-sm
">

{product.category}

</span>

)

}



</div>


</Link>


))

}


</div>


):(


<div className="
bg-white
rounded-2xl
p-12
text-center
">


<h2 className="text-2xl font-bold">

No listings yet

</h2>


<p className="text-gray-500 mt-3">

Be the first person to sell something on Halo Marketplace.

</p>



<Link

href="/sell"

className="
inline-block
mt-6
bg-black
text-white
px-6
py-3
rounded-xl
"

>

Create Listing

</Link>



</div>


)

}


</section>



</main>

);

}