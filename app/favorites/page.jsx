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





const {data:favorites,error} = await supabase

.from("favorites")

.select(`

id,

products (

id,

title,

price,

image,

location,

slug,

category

)

`)

.eq("user_id", user.id)

.order("created_at", {
ascending:false
});





if(error){

console.log(error);

return [];

}



return favorites || [];


}






export const metadata = {

title:"My Favorites | Halo Marketplace",

description:
"View your saved Halo Marketplace listings."

};







export default async function FavoritesPage(){


const favorites = await getFavorites();





return (

<main className="min-h-screen bg-gray-50">



{/* HEADER */}

<section className="
bg-black
text-white
py-14
px-6
">


<div className="
max-w-6xl
mx-auto
">


<h1 className="
text-5xl
font-bold
">

My Favorites

</h1>


<p className="
mt-4
text-gray-300
">

Saved listings you want to keep an eye on.

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
favorites.length > 0 ? (



<div className="
grid
grid-cols-1
sm:grid-cols-2
lg:grid-cols-4
gap-6
">


{

favorites.map((favorite)=>(


favorite.products && (


<Link

key={favorite.id}

href={`/product/${favorite.products.slug}`}

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

favorite.products.image ? (


<Image

src={favorite.products.image}

alt={favorite.products.title}

fill

sizes="(max-width:768px)100vw,25vw"

className="object-cover"

/>


):(


<div className="
h-full
flex
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
font-bold
text-lg
truncate
">

{favorite.products.title}

</h2>



<p className="
text-xl
font-bold
mt-3
">

${Number(
favorite.products.price
).toLocaleString()}

</p>



<p className="
text-sm
text-gray-500
mt-2
">

📍 {favorite.products.location}

</p>




{
favorite.products.category && (


<span className="
inline-block
mt-4
bg-gray-100
rounded-full
px-3
py-1
text-sm
">

{favorite.products.category}

</span>


)

}




</div>



</Link>


)


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


<h2 className="
text-2xl
font-bold
">

No favorites yet

</h2>


<p className="
text-gray-500
mt-3
">

Save listings you are interested in.

</p>



<Link

href="/browse"

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

Browse Listings

</Link>



</div>



)

}



</section>



</main>

);


}