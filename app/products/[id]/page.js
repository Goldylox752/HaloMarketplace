import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

import FavoriteButton from "@/components/FavoriteButton";
import CheckoutButton from "@/components/CheckoutButton";



async function getProduct(slug){


const supabase = await createClient();



const {data,error}=await supabase

.from("products")

.select(`
*,
profiles:seller_id(
username,
avatar,
location,
rating,
review_count,
verified
)
`)

.eq("slug",slug)

.single();




if(error || !data){

return null;

}


return data;

}







async function getRelatedProducts(
category,
id
){


const supabase = await createClient();



const {data,error}=await supabase

.from("products")

.select(`
id,
title,
price,
image,
slug
`)

.eq(
"category",
category
)

.neq(
"id",
id
)

.order(
"created_at",
{
ascending:false
}
)

.limit(4);




if(error){

return [];

}


return data || [];

}








export async function generateMetadata({
params
}){


const {slug}=await params;



const product = await getProduct(slug);



if(!product){

return {

title:"Product Not Found"

};

}




return {

title:`${product.title} | Halo Marketplace`,

description:
product.description ||
`Buy ${product.title} on Halo Marketplace`

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








export default async function ProductPage({
params
}){


const {slug}=await params;



const product = await getProduct(slug);



if(!product){

notFound();

}




const relatedProducts =
await getRelatedProducts(
product.category,
product.id
);







return (

<main className="
min-h-screen
bg-gray-50
px-6
py-16
">


<div className="
mx-auto
max-w-7xl
">





<Link

href="/browse"

className="
font-bold
text-indigo-600
"

>

← Back to Marketplace

</Link>







<div className="
mt-8
grid
gap-12
lg:grid-cols-2
">







<div className="
overflow-hidden
rounded-3xl
bg-white
shadow
">


{

product.image ? (


<Image

src={product.image}

alt={product.title}

width={900}

height={900}

priority

className="
h-[600px]
w-full
object-cover
"

/>


):(


<div className="
flex
h-[600px]
items-center
justify-center
text-8xl
">

📦

</div>


)

}


</div>









<div className="
rounded-3xl
bg-white
p-10
shadow
">





<span className="
rounded-full
bg-indigo-100
px-4
py-2
text-sm
font-bold
text-indigo-700
">

{product.category || "General"}

</span>






<h1 className="
mt-6
text-5xl
font-black
">

{product.title}

</h1>






<p className="
mt-6
text-4xl
font-black
text-indigo-600
">

{formatPrice(product.price)}

</p>







<div className="
mt-6
space-y-2
text-gray-600
">


<p>
📍 {product.location || "Canada"}
</p>


<p>
📦 {product.condition || "Used"}
</p>


</div>









<section className="
mt-10
">


<h2 className="
text-xl
font-black
">

Description

</h2>



<p className="
mt-4
leading-7
text-gray-600
">

{product.description || 
"No description available."}

</p>


</section>









<section className="
mt-10
rounded-2xl
border
p-6
">


<h2 className="
text-xl
font-black
">

Seller

</h2>




<p className="
mt-4
text-lg
font-bold
">

{product.profiles?.username || "Halo Seller"}

</p>



<p className="
mt-2
text-gray-500
">

📍 {product.profiles?.location || "Canada"}

</p>




<p className="
mt-2
">

⭐ {product.profiles?.rating || "5.0"}

({product.profiles?.review_count || 0} reviews)

</p>



</section>









<div className="
mt-10
space-y-4
">


<CheckoutButton

productId={product.id}

/>



<FavoriteButton

productId={product.id}

/>





<Link

href={`/messages?seller=${product.seller_id}`}

className="
block
rounded-xl
border
py-4
text-center
font-bold
hover:bg-gray-100
"

>

💬 Message Seller

</Link>



</div>






</div>





</div>









{
relatedProducts.length > 0 && (


<section className="
mt-20
">


<h2 className="
mb-8
text-3xl
font-black
">

Related Listings

</h2>



<div className="
grid
gap-6
sm:grid-cols-2
lg:grid-cols-4
">


{
relatedProducts.map(item=>(


<Link

key={item.id}

href={`/product/${item.slug}`}

className="
overflow-hidden
rounded-2xl
bg-white
shadow
hover:shadow-xl
"

>


{

item.image && (

<Image

src={item.image}

alt={item.title}

width={400}

height={300}

className="
h-48
w-full
object-cover
"

/>

)

}



<div className="
p-5
">


<h3 className="
font-bold
">

{item.title}

</h3>



<p className="
mt-2
font-black
">

{formatPrice(item.price)}

</p>


</div>


</Link>


))

}



</div>


</section>


)

}





</div>


</main>

);

}