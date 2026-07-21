import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";



async function getFavorites(){

  const supabase = await createClient();


  const {
    data:{
      user
    }
  } = await supabase.auth.getUser();



  if(!user){

    redirect("/login");

  }



  const {
    data:favorites,
    error
  } = await supabase
    .from("favorites")
    .select(`
      product_id,
      created_at
    `)
    .eq("user_id", user.id)
    .order("created_at", {
      ascending:false
    });



  if(error){

    console.log(error);

    return [];

  }



  if(!favorites?.length){

    return [];

  }



  const productIds = favorites.map(
    item => item.product_id
  );



  const {
    data:products,
    error:productsError
  } = await supabase
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
    .in("id", productIds);



  if(productsError){

    console.log(productsError);

    return [];

  }



  // Keep favorites newest first

  return productIds
    .map(id =>
      products.find(product => product.id === id)
    )
    .filter(Boolean);


}






export const metadata = {

  title:"Favorites | Halo Marketplace",

  description:
  "Your saved Halo Marketplace listings."

};







export default async function FavoritesPage(){


const products = await getFavorites();



return (

<main className="min-h-screen bg-gray-50">



<section className="
bg-black
text-white
py-16
px-6
">


<div className="max-w-6xl mx-auto">


<h1 className="
text-5xl
font-black
">

❤️ Favorites

</h1>


<p className="
mt-4
text-lg
text-gray-300
">

Your saved marketplace listings.

</p>


</div>


</section>







<section className="
max-w-6xl
mx-auto
px-6
py-12
">



{
products.length === 0 ? (


<div className="
rounded-3xl
bg-white
p-12
text-center
shadow
">


<h2 className="
text-3xl
font-bold
">

No favorites yet

</h2>


<p className="
mt-4
text-gray-500
">

Save listings while browsing Halo Marketplace.

</p>



<Link

href="/browse"

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

Browse Marketplace

</Link>



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
products.map(product => (


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
h-56
bg-gray-100
">


{
product.image ? (


<Image

src={product.image}

alt={product.title}

fill

sizes="(max-width:768px) 100vw, 25vw"

className="object-cover"

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


<h2 className="
truncate
text-lg
font-bold
">

{product.title}

</h2>



<p className="
mt-3
text-2xl
font-black
">

{Number(product.price).toLocaleString(
"en-CA",
{
style:"currency",
currency:"CAD"
}
)}

</p>




<p className="
mt-2
text-sm
text-gray-500
">

📍 {product.location || "Canada"}

</p>




{
product.category && (


<span className="
mt-4
inline-block
rounded-full
bg-gray-100
px-3
py-1
text-sm
font-medium
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



</main>

);

}