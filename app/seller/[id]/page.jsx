import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { createClient } from "@/lib/supabase/server";



async function getSeller(id){

const supabase = await createClient();



const {
data:profile,
error
}=await supabase

.from("profiles")

.select(`
id,
username,
avatar,
location,
rating,
review_count,
verified,
created_at
`)

.eq(
"id",
id
)

.single();



if(error || !profile){

return null;

}





const {
data:products
}=await supabase

.from("products")

.select(`
id,
title,
price,
image,
slug,
category,
created_at
`)

.eq(
"seller_id",
id
)

.eq(
"status",
"active"
)

.order(
"created_at",
{
ascending:false
}
);




return {

profile,

products:products || []

};


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







export async function generateMetadata({params}){


const {id}=await params;


const seller=await getSeller(id);



return {

title:
seller
? `${seller.profile.username} | Halo Marketplace`
:"Seller Not Found",

description:
seller
? `Shop products from ${seller.profile.username} on Halo Marketplace.`
:"Seller profile not found."

};


}







export default async function SellerPage({params}){


const {id}=await params;


const seller=await getSeller(id);



if(!seller){

notFound();

}



const {

profile,

products

}=seller;






return (

<main className="
min-h-screen
bg-gray-50
px-6
py-16
">


<div className="
max-w-6xl
mx-auto
">







{/* SELLER PROFILE */}



<section className="
rounded-3xl
bg-white
p-10
shadow-sm
">


<div className="
flex
flex-col
md:flex-row
md:items-center
justify-between
gap-6
">


<div className="
flex
items-center
gap-6
">



{

profile.avatar ? (

<Image

src={profile.avatar}

width={100}

height={100}

alt={profile.username || "Seller"}

className="
rounded-full
"

/>


):(


<div className="
flex
h-24
w-24
items-center
justify-center
rounded-full
bg-gray-200
text-5xl
">

👤

</div>


)

}






<div>


<h1 className="
text-4xl
font-black
">

{profile.username || "Halo Seller"}

</h1>



<p className="
mt-2
text-gray-600
">

📍 {profile.location || "Canada"}

</p>




<p className="
mt-2
font-bold
">

⭐ {profile.rating || "5.0"}

({profile.review_count || 0} reviews)

</p>



</div>



</div>







{

profile.verified && (

<div className="
rounded-full
bg-green-100
px-5
py-2
font-bold
text-green-700
">

✓ Verified Seller

</div>


)

}



</div>





<div className="
mt-8
grid
grid-cols-2
md:grid-cols-3
gap-4
">



<div className="
rounded-2xl
bg-gray-100
p-5
">

<p className="text-gray-500">

Listings

</p>


<h3 className="
text-3xl
font-black
">

{products.length}

</h3>


</div>





<div className="
rounded-2xl
bg-gray-100
p-5
">

<p className="text-gray-500">

Rating

</p>


<h3 className="
text-3xl
font-black
">

⭐ {profile.rating || "5.0"}

</h3>


</div>





<div className="
rounded-2xl
bg-gray-100
p-5
">

<p className="text-gray-500">

Member Since

</p>


<h3 className="
text-lg
font-black
">

{profile.created_at
?
new Date(profile.created_at)
.getFullYear()
:
"2026"
}

</h3>


</div>



</div>




</section>








{/* CONTACT */}



<Link

href={`/messages?seller=${profile.id}`}

className="
mt-8
block
rounded-xl
bg-black
py-4
text-center
font-bold
text-white
"

>

💬 Contact Seller

</Link>









{/* LISTINGS */}



<section className="
mt-16
">


<div className="
flex
justify-between
items-center
mb-8
">


<h2 className="
text-3xl
font-black
">

Seller Listings

</h2>


</div>






{
products.length === 0 ? (


<div className="
rounded-3xl
bg-white
p-12
text-center
">


<h3 className="
text-2xl
font-bold
">

No Active Listings

</h3>


<p className="
mt-3
text-gray-500
">

This seller has no products available.

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
rounded-2xl
bg-white
shadow-sm
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
mt-3
text-xl
font-black
text-indigo-600
">

{formatPrice(product.price)}

</p>



<p className="
mt-2
text-sm
text-gray-500
">

🏷️ {product.category || "General"}

</p>



</div>



</Link>


))


}



</div>



)

}



</section>







</div>

</main>

);


}