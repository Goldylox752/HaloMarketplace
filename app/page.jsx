import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";


async function getProducts(search, category, location){

const supabase = await createClient();


let query = supabase
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
.order("created_at",{
ascending:false
})
.limit(12);



if(search){

query=query.ilike(
"title",
`%${search}%`
);

}



if(category){

query=query.eq(
"category",
category
);

}



if(location){

query=query.ilike(
"location",
`%${location}%`
);

}



const {data,error}=await query;



if(error){

console.log(error);

return [];

}


return data || [];

}





export const metadata={

title:
"Halo Marketplace | Buy & Sell Across Canada",

description:
"Buy and sell electronics, vehicles, home goods and more on Halo Marketplace."

};





export default async function Home({searchParams}){


const params = await searchParams;


const search=params?.search || "";

const category=params?.category || "";

const location=params?.location || "";



const products=await getProducts(
search,
category,
location
);



return (

<main className="min-h-screen bg-white">


{/* HERO */}

<section className="bg-black text-white px-6 py-24">


<div className="max-w-6xl mx-auto">


<h1 className="
text-5xl
md:text-7xl
font-black
">

Halo Marketplace

</h1>



<p className="
mt-6
max-w-2xl
text-xl
text-gray-300
">

Canada's modern marketplace to buy, sell, and discover products locally.

</p>



<div className="flex gap-4 mt-8">


<Link

href="/sell"

className="
rounded-xl
bg-white
text-black
px-7
py-4
font-bold
"

>

Sell Something

</Link>



<Link

href="/browse"

className="
rounded-xl
border
border-white
px-7
py-4
font-bold
"

>

Browse Listings

</Link>


</div>


</div>


</section>





{/* TRUST STATS */}

<section className="
max-w-6xl
mx-auto
grid
grid-cols-2
md:grid-cols-4
gap-5
px-6
py-12
">


{[
["10,000+","Products"],
["5,000+","Sellers"],
["Canada","Wide"],
["Secure","Payments"]
].map(stat=>(


<div
key={stat[1]}
className="
rounded-2xl
bg-gray-100
p-6
text-center
"
>

<h3 className="text-3xl font-black">
{stat[0]}
</h3>

<p className="text-gray-500 mt-2">
{stat[1]}
</p>


</div>


))}


</section>







{/* SEARCH */}


<section className="
max-w-6xl
mx-auto
px-6
">


<form

action="/"

className="
grid
md:grid-cols-4
gap-4
bg-white
rounded-3xl
shadow-xl
p-6
"

>


<input

name="search"

defaultValue={search}

placeholder="Search products..."

className="
border
rounded-xl
px-5
py-4
"

/>




<select

name="category"

defaultValue={category}

className="
border
rounded-xl
px-5
py-4
"

>

<option value="">
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
Tools
</option>

</select>





<select

name="location"

defaultValue={location}

className="
border
rounded-xl
px-5
py-4
"

>

<option value="">
All Canada
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




<button

className="
rounded-xl
bg-black
text-white
font-bold
"

>

Search

</button>



</form>


</section>







{/* CATEGORIES */}


<section className="
max-w-6xl
mx-auto
px-6
py-16
">


<h2 className="
text-3xl
font-black
mb-8
">

Explore Categories

</h2>



<div className="
grid
grid-cols-2
md:grid-cols-6
gap-4
">


{[
"📱 Electronics",
"🚗 Vehicles",
"🏠 Home",
"🎮 Gaming",
"🛠 Tools",
"⚽ Sports"
].map(cat=>(


<Link

key={cat}

href={`/?category=${cat.split(" ")[1]}`}

className="
rounded-2xl
border
p-6
text-center
font-bold
hover:shadow-lg
"

>

{cat}

</Link>


))}


</div>


</section>







{/* PRODUCTS */}


<section className="
max-w-6xl
mx-auto
px-6
pb-20
">


<div className="
flex
justify-between
mb-8
">


<h2 className="
text-3xl
font-black
">

{search || category ? "Results" : "Latest Listings"}

</h2>


<Link

href="/browse"

className="text-indigo-600 font-bold"

>

View All →

</Link>


</div>





<div className="
grid
sm:grid-cols-2
lg:grid-cols-4
gap-6
">


{products.map((product,index)=>(


<Link

key={product.id}

href={`/product/${product.slug}`}

className="
rounded-3xl
overflow-hidden
bg-white
border
hover:shadow-xl
transition
"

>


<div className="
relative
h-56
bg-gray-100
">


{product.image ? (

<Image

src={product.image}

alt={product.title}

fill

priority={index < 4}

className="object-cover"

/>


):(


<div className="
flex
items-center
justify-center
h-full
text-5xl
">

📦

</div>


)}


</div>



<div className="p-5">


<h3 className="
font-bold
truncate
">

{product.title}

</h3>


<p className="
mt-2
text-gray-500
">

📍 {product.location || "Canada"}

</p>



<p className="
mt-3
text-xl
font-black
">

${Number(product.price).toLocaleString("en-CA")}

</p>


</div>



</Link>


))}



</div>


</section>







{/* SELL CTA */}


<section className="
bg-black
text-white
text-center
py-20
px-6
">


<h2 className="
text-4xl
font-black
">

Start Selling Today

</h2>


<p className="
mt-4
text-gray-300
">

Create your free listing and reach buyers across Canada.

</p>



<Link

href="/sell"

className="
inline-block
mt-8
bg-white
text-black
px-8
py-4
rounded-xl
font-bold
"

>

Create Listing

</Link>


</section>



</main>

)

}