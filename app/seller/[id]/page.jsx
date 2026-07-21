import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { createClient } from "@/lib/supabase/server";



async function getSeller(id){

  const supabase = await createClient();



  const {
    data: profile,
    error
  } = await supabase

  .from("profiles")

  .select(`

    id,

    username,

    store_name,

    store_description,

    avatar,

    location,

    verified,

    seller_rating,

    sales_count,

    review_count,

    followers,

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
    data: products,
    error: productError

  } = await supabase

  .from("products")

  .select(`

    id,

    title,

    price,

    image,

    slug,

    category,

    featured,

    created_at

  `)

  .eq(
    "user_id",
    id
  )

  .eq(
    "status",
    "active"
  )

  .order(
    "featured",
    {
      ascending:false
    }
  )

  .order(
    "created_at",
    {
      ascending:false
    }
  );




  return {

    profile,

    products: products || []

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


  const seller =
  await getSeller(id);



  if(!seller){

    return {

      title:"Seller Not Found | Halo Marketplace"

    };

  }




  return {

    title:
    `${seller.profile.store_name || seller.profile.username} | Halo Marketplace`,


    description:
    `Shop products from ${seller.profile.username} on Halo Marketplace.`

  };


}
export default async function SellerPage({params}){


const {id}=await params;


const seller =
await getSeller(id);



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
mx-auto
max-w-7xl
">



{/* SELLER HERO */}


<section className="
rounded-3xl
bg-white
p-10
shadow-sm
">


<div className="
flex
flex-col
gap-8
md:flex-row
md:items-center
md:justify-between
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

alt={profile.username || "Seller"}

width={120}

height={120}

className="
rounded-full
object-cover
"

/>


):(


<div className="
flex
h-28
w-28
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


<div className="
flex
items-center
gap-3
">


<h1 className="
text-4xl
font-black
">

{profile.store_name ||
profile.username ||
"Halo Store"}

</h1>



{

profile.verified && (

<span className="
rounded-full
bg-green-100
px-3
py-1
text-sm
font-bold
text-green-700
">

✓ Verified

</span>

)

}



</div>




<p className="
mt-3
text-gray-600
">

📍 {profile.location || "Canada"}

</p>



<p className="
mt-2
text-gray-500
">

Member since {

new Date(
profile.created_at
)
.getFullYear()

}

</p>



</div>



</div>





<Link

href={`/messages?seller=${profile.id}`}

className="
rounded-xl
bg-black
px-8
py-4
text-center
font-bold
text-white
"

>

💬 Message Seller

</Link>




</div>





<p className="
mt-8
max-w-3xl
text-gray-600
">

{

profile.store_description ||

"Trusted Halo Marketplace seller."

}

</p>



</section>







{/* SELLER TRUST STATS */}


<section className="
mt-8
grid
gap-6
md:grid-cols-4
">



<div className="
rounded-3xl
bg-white
p-6
">


<p className="
text-gray-500
">

Listings

</p>


<h2 className="
mt-2
text-4xl
font-black
">

{products.length}

</h2>


</div>






<div className="
rounded-3xl
bg-white
p-6
">


<p className="
text-gray-500
">

Rating

</p>


<h2 className="
mt-2
text-4xl
font-black
">

⭐ {profile.seller_rating || "5.0"}

</h2>


</div>







<div className="
rounded-3xl
bg-white
p-6
">


<p className="
text-gray-500
">

Sales

</p>


<h2 className="
mt-2
text-4xl
font-black
">

{profile.sales_count || 0}

</h2>


</div>






<div className="
rounded-3xl
bg-white
p-6
">


<p className="
text-gray-500
">

Followers

</p>


<h2 className="
mt-2
text-4xl
font-black
">

{profile.followers || 0}

</h2>


</div>



</section>
{/* SEO STRUCTURED DATA */}

<script
type="application/ld+json"
dangerouslySetInnerHTML={{
__html: JSON.stringify({

"@context":"https://schema.org",

"@type":"Store",

"name":
profile.store_name ||
profile.username ||
"Halo Marketplace Seller",

"image":
profile.avatar || "",

"address":{

"@type":"PostalAddress",

"addressCountry":"Canada",

"addressLocality":
profile.location || "Canada"

},

"aggregateRating":{

"@type":"AggregateRating",

"ratingValue":
profile.seller_rating || "5",

"reviewCount":
profile.review_count || 0

}

})

}}

/>







{/* STORE PRODUCTS */}


<section className="
mt-16
">


<div className="
mb-8
flex
items-center
justify-between
">


<div>


<h2 className="
text-4xl
font-black
">

Store Products

</h2>


<p className="
mt-2
text-gray-600
">

Browse this seller's active listings.

</p>


</div>




<Link

href="/browse"

className="
font-bold
text-indigo-600
"

>

View Marketplace →

</Link>



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
font-black
">

No Products Listed

</h3>


<p className="
mt-3
text-gray-500
">

This seller has no active listings.

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

products.map(product => (


<Link

key={product.id}

href={`/product/${product.slug}`}

className="
group
overflow-hidden
rounded-3xl
bg-white
shadow-sm
transition
hover:-translate-y-1
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

sizes="
(max-width:768px) 100vw,
25vw
"

className="
object-cover
transition
group-hover:scale-105
"

/>


):(


<div className="
flex
h-full
items-center
justify-center
text-6xl
">

📦

</div>


)

}



{

product.featured && (

<span className="
absolute
left-4
top-4
rounded-full
bg-black
px-3
py-1
text-xs
font-bold
text-white
">

⭐ Featured

</span>


)

}



</div>







<div className="
p-5
">



<h3 className="
truncate
text-lg
font-black
">

{product.title}

</h3>





<p className="
mt-3
text-2xl
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







{/* FOLLOW STORE CTA */}


<section className="
mt-16
rounded-3xl
bg-black
p-12
text-center
text-white
">


<h2 className="
text-4xl
font-black
">

Follow This Store

</h2>



<p className="
mx-auto
mt-4
max-w-xl
text-gray-300
">

Get notified when this seller adds new products.

</p>




<button

className="
mt-8
rounded-xl
bg-white
px-10
py-4
font-black
text-black
"

>

⭐ Follow Seller

</button>



</section>





</div>


</main>


);


}
