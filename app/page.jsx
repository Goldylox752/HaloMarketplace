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
    .order("created_at", {
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
    data:products,
    error
  } = await query;



  if(error){

    console.log(error);

    return [];

  }



  return products || [];

}





export const metadata = {

  title:"Halo Marketplace | Buy & Sell Locally",

  description:
  "Buy, sell, and discover products on Halo Marketplace."

};






export default async function Home({searchParams}){


const search = searchParams?.search || "";

const category = searchParams?.category || "";

const location = searchParams?.location || "";



const products = await getProducts(
  search,
  category,
  location
);





return (

<main className="min-h-screen bg-white">



{/* HERO */}


<section className="
bg-black
text-white
py-20
px-6
">


<div className="
max-w-6xl
mx-auto
">


<h1 className="
text-5xl
md:text-6xl
font-bold
">

Halo Marketplace

</h1>



<p className="
mt-5
max-w-2xl
text-xl
text-gray-300
">

Buy, sell, and discover products from people near you.

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
px-6
py-3
font-semibold
text-black
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
px-6
py-3
font-semibold
"

>

Browse Listings

</Link>


</div>


</div>


</section>







{/* SEARCH FILTERS */}



<section className="
max-w-6xl
mx-auto
px-6
-mt-8
">


<form

action="/"

className="
bg-white
rounded-2xl
shadow-xl
p-6
grid
md:grid-cols-4
gap-4
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
outline-none
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

<option value="Electronics">
Electronics
</option>

<option value="Vehicles">
Vehicles
</option>

<option value="Home">
Home
</option>

<option value="Gaming">
Gaming
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
All Locations
</option>

<option value="Alberta">
Alberta
</option>

<option value="Ontario">
Ontario
</option>

<option value="British Columbia">
British Columbia
</option>


</select>





<button

type="submit"

className="
rounded-xl
bg-black
px-6
py-4
font-semibold
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
py-12
">


<h2 className="
mb-6
text-2xl
font-bold
">

Explore Categories

</h2>




<div className="
grid
grid-cols-2
md:grid-cols-4
gap-4
">


{
[
"Electronics",
"Vehicles",
"Home",
"Gaming"
].map(item=>(


<Link

key={item}

href={`/?category=${item}`}

className="
rounded-xl
border
p-6
text-center
hover:shadow-lg
"

>

{item}

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
flex
justify-between
items-center
mb-8
">


<h2 className="
text-3xl
font-bold
">

{
search || category || location

? "Search Results"

: "Latest Listings"

}

</h2>



<Link

href="/browse"

className="
text-blue-600
font-semibold
"

>

View All

</Link>



</div>







{
products.length === 0 ? (


<div className="
rounded-2xl
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

Try changing your search filters.

</p>


</div>


):(



<div className="
grid
grid-cols-1
sm:grid-cols-2
lg:grid-cols-4
gap-6
">


{

products.map(product=>(


<Link

key={product.id}

href={`/product/${product.slug}`}

className="
overflow-hidden
rounded-2xl
border
transition
hover:shadow-xl
"

>


<div className="
relative
h-52
bg-gray-100
">


{

product.image ? (


<Image

src={product.image}

alt={product.title}

fill

sizes="(max-width:768px)100vw,25vw"

className="
object-cover
"

/>


):(


<div className="
flex
h-full
items-center
justify-center
text-gray-400
">

No Image

</div>


)

}


</div>






<div className="p-5">


<h3 className="
truncate
font-bold
text-lg
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

${Number(product.price).toLocaleString("en-CA")}

</p>



{
product.category && (

<span className="
mt-3
inline-block
rounded-full
bg-gray-100
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



)

}



</section>








{/* SELL CTA */}



<section className="
bg-gray-100
py-16
px-6
text-center
">


<h2 className="
text-3xl
font-bold
">

Ready to sell?

</h2>


<p className="
mt-3
text-gray-600
">

Create your listing and reach buyers today.

</p>



<Link

href="/sell"

className="
mt-6
inline-block
rounded-xl
bg-black
px-8
py-3
font-bold
text-white
"

>

Post Item

</Link>



</section>



</main>

);

}