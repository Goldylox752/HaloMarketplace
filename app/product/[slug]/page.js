import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";



async function getProduct(slug){

  const supabase = await createClient();


  const {data,error} = await supabase

  .from("products")

  .select(`
    id,
    title,
    price,
    image,
    description,
    location,
    category,
    created_at,
    seller_id,
    profiles(
      id,
      username,
      avatar,
      bio,
      location,
      verified,
      seller_rating,
      sales_count
    )
  `)

  .eq(
    "slug",
    slug
  )

  .single();



  if(error || !data){

    return null;

  }



  return data;

}







async function getSimilarProducts(category, productId){

  const supabase = await createClient();


  const {data,error} = await supabase

  .from("products")

  .select(`
    id,
    title,
    price,
    image,
    slug,
    location,
    category
  `)

  .eq(
    "category",
    category
  )

  .neq(
    "id",
    productId
  )

  .limit(6);



  if(error){

    console.error(error);

    return [];

  }



  return data || [];

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


  const product =
  await getProduct(
    params.slug
  );



  if(!product){

    return {

      title:
      "Halo Marketplace"

    };

  }




  return {

    title:
    `${product.title} | Halo Marketplace`,


    description:
    product.description?.slice(0,160)

  };


}







export default async function ProductPage({params}){


  const product =
  await getProduct(
    params.slug
  );



  if(!product){

    notFound();

  }




  const seller =
  product.profiles;



  const similarProducts =
  await getSimilarProducts(
    product.category,
    product.id
  );



  const schema = {

    "@context":"https://schema.org",

    "@type":"Product",

    "name":
    product.title,


    "description":
    product.description,


    "image":
    product.image,


    "offers":{

      "@type":"Offer",

      "priceCurrency":"CAD",

      "price":
      product.price,


      "availability":
      "https://schema.org/InStock"

    },


    "seller":{

      "@type":"Person",

      "name":
      seller?.username || "Halo Seller"

    }


  };



return (

<main className="
min-h-screen
bg-gray-50
px-6
py-12
">


<script

type="application/ld+json"

dangerouslySetInnerHTML={{

__html:
JSON.stringify(schema)

}}

/>


<div className="
mx-auto
grid
max-w-7xl
gap-10
lg:grid-cols-3
">
{/* ================= PRODUCT SECTION ================= */}


<section className="
lg:col-span-2
">


<div className="
relative
h-[500px]
overflow-hidden
rounded-3xl
bg-white
">


{product.image ? (

<Image

src={product.image}

alt={product.title}

fill

className="
object-cover
"

/>

) : (

<div className="
flex
h-full
items-center
justify-center
text-7xl
">

📦

</div>

)}


</div>







<div className="
mt-8
rounded-3xl
bg-white
p-8
">


<div className="
flex
flex-wrap
gap-3
">


<span className="
rounded-full
bg-gray-100
px-4
py-2
text-sm
font-bold
">

{product.category || "General"}

</span>



<span className="
rounded-full
bg-green-100
px-4
py-2
text-sm
font-bold
text-green-700
">

Available

</span>


</div>






<h1 className="
mt-6
text-4xl
font-black
md:text-5xl
">

{product.title}

</h1>






<p className="
mt-5
text-gray-600
">

📍 {product.location || "Canada"}

</p>







<p className="
mt-8
text-4xl
font-black
">

{formatPrice(product.price)}

</p>








<div className="
mt-8
border-t
pt-8
">


<h2 className="
text-2xl
font-black
">

Description

</h2>



<p className="
mt-4
leading-relaxed
text-gray-700
">

{product.description || 
"No description provided."}

</p>


</div>



</div>


</section>








{/* ================= SELLER CARD ================= */}


<aside className="
h-fit
rounded-3xl
bg-white
p-8
shadow-sm
">


<h2 className="
text-2xl
font-black
">

Seller Information

</h2>







<div className="
mt-6
flex
items-center
gap-4
">



{seller?.avatar ? (


<div className="
relative
h-16
w-16
overflow-hidden
rounded-full
">


<Image

src={seller.avatar}

alt={seller.username || "Seller"}

fill

className="
object-cover
"

/>


</div>



) : (


<div className="
flex
h-16
w-16
items-center
justify-center
rounded-full
bg-gray-200
text-2xl
">

👤

</div>


)}






<div>


<h3 className="
text-xl
font-black
">

{seller?.username || "Halo Seller"}

</h3>






{seller?.verified ? (

<span className="
mt-2
inline-block
rounded-full
bg-green-100
px-3
py-1
text-xs
font-bold
text-green-700
">

✓ Verified Seller

</span>


) : (


<span className="
mt-2
inline-block
rounded-full
bg-gray-100
px-3
py-1
text-xs
font-bold
">

New Seller

</span>


)}



</div>


</div>








<div className="
mt-8
grid
grid-cols-2
gap-4
">


<div className="
rounded-2xl
bg-gray-100
p-4
text-center
">


<p className="
text-2xl
font-black
">

⭐ {seller?.seller_rating || "New"}

</p>


<p className="
text-sm
text-gray-500
">

Rating

</p>


</div>





<div className="
rounded-2xl
bg-gray-100
p-4
text-center
">


<p className="
text-2xl
font-black
">

{seller?.sales_count || 0}

</p>


<p className="
text-sm
text-gray-500
">

Sales

</p>


</div>


</div>






<p className="
mt-6
text-sm
text-gray-600
">

📍 {seller?.location || product.location || "Canada"}

</p>






<div className="
mt-8
flex
flex-col
gap-3
">


<Link

href={`/messages?seller=${seller?.id}`}

className="
rounded-xl
bg-black
px-6
py-4
text-center
font-bold
text-white
"

>

💬 Message Seller

</Link>





<Link

href={`/seller/${seller?.id}`}

className="
rounded-xl
border
px-6
py-4
text-center
font-bold
"

>

🏪 View Seller Store

</Link>


</div>




<button

className="
mt-6
w-full
rounded-xl
bg-gray-100
py-3
font-bold
"

>

⚠️ Report Listing

</button>



</aside>
{/* ================= SIMILAR PRODUCTS ================= */}


<section className="
col-span-full
mt-10
">


<div className="
rounded-3xl
bg-white
p-8
">


<div className="
flex
items-center
justify-between
">


<h2 className="
text-3xl
font-black
">

Similar Products

</h2>


<Link

href={`/browse?category=${product.category}`}

className="
font-bold
text-indigo-600
"

>

View More →

</Link>


</div>







<div className="
mt-8
grid
gap-6
sm:grid-cols-2
lg:grid-cols-3
">


{similarProducts.length > 0 ? (

similarProducts.map(item => (


<Link

key={item.id}

href={`/product/${item.slug}`}

className="
overflow-hidden
rounded-3xl
border
transition
hover:shadow-xl
"

>


<div className="
relative
h-48
bg-gray-100
">


{item.image ? (

<Image

src={item.image}

alt={item.title}

fill

className="
object-cover
"

/>

) : (

<div className="
flex
h-full
items-center
justify-center
text-5xl
">

📦

</div>

)}



</div>







<div className="p-5">


<span className="
rounded-full
bg-gray-100
px-3
py-1
text-xs
font-bold
">

{item.category || "General"}

</span>





<h3 className="
mt-4
truncate
font-black
">

{item.title}

</h3>





<p className="
mt-3
text-xl
font-black
">

{formatPrice(item.price)}

</p>





<p className="
mt-2
text-sm
text-gray-500
">

📍 {item.location || "Canada"}

</p>



</div>


</Link>


))


) : (


<p className="
text-gray-500
">

No similar products found.

</p>


)}


</div>


</div>


</section>







</div>


</main>

);

}