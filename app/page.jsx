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
category,
created_at
`)
.order("created_at",{
ascending:false
})
.limit(12);



if(search){

query = query.ilike(
"title",
`%${search}%`
);

}


if(category){

query = query.eq(
"category",
category
);

}


if(location){

query = query.ilike(
"location",
`%${location}%`
);

}



const {
data,
error
}=await query;



if(error){

console.error(error);

return [];

}



return data || [];

}





export const metadata={

title:
"Halo Marketplace Canada | Buy & Sell Locally",

description:
"Buy and sell electronics, vehicles, home goods and more across Canada with Halo Marketplace."

};





function formatPrice(price){

return new Intl.NumberFormat(
"en-CA",
{
style:"currency",
currency:"CAD"
}
).format(price || 0);

}





export default async function Home({searchParams}){


const params = await searchParams;


const search=params?.search || "";

const category=params?.category || "";

const location=params?.location || "";



const products = await getProducts(
search,
category,
location
);




const categories=[

{
name:"Electronics",
icon:"📱"
},

{
name:"Vehicles",
icon:"🚗"
},

{
name:"Home",
icon:"🏠"
},

{
name:"Gaming",
icon:"🎮"
},

{
name:"Tools",
icon:"🛠"
},

{
name:"Sports",
icon:"⚽"
}

];





return (

<main className="min-h-screen bg-white">



{/* HERO */}

<section className="
bg-black
text-white
px-6
py-24
">


<div className="
max-w-6xl
mx-auto
">


<h1 className="
text-5xl
md:text-7xl
font-black
">

Canada's Modern Marketplace

</h1>



<p className="
mt-6
max-w-2xl
text-xl
text-gray-300
">

Buy, sell, and discover products from local sellers across Canada.

</p>




<div className="
flex
gap-4
mt-8
">


<Link

href="/sell"

className="
rounded-xl
bg-white
px-8
py-4
font-bold
text-black
"

>

Start Selling

</Link>



<Link

href="/browse"

className="
rounded-xl
border
border-white
px-8
py-4
font-bold
"

>

Browse Listings

</Link>


</div>



</div>


</section>








{/* TRUST */}

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

["Local","Marketplace"],

["Secure","Checkout"],

["Verified","Sellers"],

["Canada","Wide"]

].map(item=>(


<div

key={item[1]}

className="
rounded-2xl
bg-gray-100
p-6
text-center
"

>


<h3 className="
text-3xl
font-black
">

{item[0]}

</h3>


<p className="
mt-2
text-gray-500
">

{item[1]}

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
gap-4
md:grid-cols-4
rounded-3xl
bg-white
p-6
shadow-xl
"

>


<input

name="search"

defaultValue={search}

placeholder="Search products..."

className="
rounded-xl
border
px-5
py-4
"

/>





<select

name="category"

defaultValue={category}

className="
rounded-xl
border
px-5
py-4
"

>

<option value="">
All Categories
</option>

{

categories.map(cat=>(

<option key={cat.name}>
{cat.name}
</option>

))

}


</select>





<select

name="location"

defaultValue={location}

className="
rounded-xl
border
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
font-bold
text-white
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
mb-8
text-3xl
font-black
">

Explore Categories

</h2>




<div className="
grid
grid-cols-2
md:grid-cols-6
gap-4
">


{

categories.map(cat=>(


<Link

key={cat.name}

href={`/?category=${cat.name}`}

className="
rounded-2xl
border
p-6
text-center
font-bold
hover:shadow-xl
transition
"

>


<div className="
text-3xl
">

{cat.icon}

</div>


<p className="mt-3">

{cat.name}

</p>



</Link>


))

}



</div>


</section>









{/* LISTINGS */}

<section className="
max-w-6xl
mx-auto
px-6
pb-20
">


<div className="
mb-8
flex
justify-between
items-center
">


<h2 className="
text-3xl
font-black
">

{
search || category

?

"Search Results"

:

"Latest Listings"

}

</h2>



<Link

href="/browse"

className="
font-bold
text-indigo-600
"

>

View All →

</Link>


</div>







{
products.length === 0 ? (


<div className="
rounded-3xl
bg-gray-100
p-12
text-center
">


<h3 className="
text-2xl
font-bold
">

No listings found

</h3>


<p className="
mt-3
text-gray-500
">

Be the first person to sell on Halo.

</p>


</div>


):(



<div className="
grid
gap-6
sm:grid-cols-2
lg:grid-cols-4
">


{

products.map(product=>(


<Link

key={product.id}

href={`/product/${product.slug}`}

className="
overflow-hidden
rounded-3xl
border
bg-white
transition
hover:shadow-xl
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

className="object-cover"

/>

):(


<div className="
flex
h-full
items-center
justify-center
text-5xl
">

📦

</div>

)

}


</div>






<div className="p-5">


<h3 className="
truncate
font-bold
">

{product.title}

</h3>


<p className="
mt-2
text-sm
text-gray-500
">

📍 {product.location || "Canada"}

</p>



<p className="
mt-3
text-xl
font-black
">

{formatPrice(product.price)}

</p>



<span className="
mt-3
inline-block
rounded-full
bg-gray-100
px-3
py-1
text-sm
"

>

⭐ Verified Seller

</span>


</div>


</Link>


))


}


</div>


)

}


</section>









{/* HOW IT WORKS */}

<section className="
bg-gray-100
py-16
px-6
">


<div className="
max-w-6xl
mx-auto
">


<h2 className="
text-3xl
font-black
text-center
">

How Halo Works

</h2>



<div className="
mt-10
grid
md:grid-cols-4
gap-6
">


[

["1","Find an item"],

["2","Message seller"],

["3","Pay securely"],

["4","Receive product"]

].map(step=>(


<div

key={step[0]}

className="
rounded-2xl
bg-white
p-6
text-center
"


>


<h3 className="
text-3xl
font-black
">

{step[0]}

</h3>


<p className="mt-3">

{step[1]}

</p>


</div>


))


</div>


</div>


</section>








{/* SELL CTA */}

<section className="
bg-black
px-6
py-20
text-center
text-white
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

Create your listing and reach buyers across Canada.

</p>



<Link

href="/sell"

className="
mt-8
inline-block
rounded-xl
bg-white
px-8
py-4
font-bold
text-black
"

>

Create Free Listing

</Link>


</section>



</main>

)

}