import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";



async function logout(){

"use server";

const supabase = await createClient();

await supabase.auth.signOut();

redirect("/");

}





async function deleteProduct(formData){

"use server";


const supabase = await createClient();


const {
data:{
user
}

}=await supabase.auth.getUser();



if(!user){

redirect("/login");

}



const productId =
formData.get("productId");



if(!productId) return;




await supabase

.from("products")

.update({

status:"inactive"

})

.eq(
"id",
productId
)

.eq(
"user_id",
user.id
);



revalidatePath("/dashboard");



}








async function getDashboardData(){


const supabase = await createClient();



const {
data:{
user
}

}=await supabase.auth.getUser();



if(!user){

redirect("/login");

}







const {

data:profile

}=await supabase

.from("profiles")

.select(`

username,
avatar,
location,
verified,
seller_rating,
sales_count,
store_name,
store_description

`)

.eq(
"id",
user.id
)

.single();







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
location,
status,
created_at

`)

.eq(
"user_id",
user.id
)

.order(
"created_at",
{
ascending:false
}

);







const {

count:listingViews

}=await supabase

.from("product_views")

.select(
"id",
{
count:"exact",
head:true
}

)

.in(

"product_id",

products?.map(
p=>p.id
) || []

);






const {

data:favorites

}=await supabase

.from("favorites")

.select("id")

.eq(
"user_id",
user.id
);







return {

user,

profile:profile || {},

products:products || [],

views:listingViews || 0,

favorites:favorites?.length || 0

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
export default async function DashboardPage(){


const {

user,

profile,

products,

views,

favorites

}=await getDashboardData();





return (

<main className="
min-h-screen
bg-gray-50
px-6
py-12
">


<div className="
mx-auto
max-w-7xl
">





{/* HEADER */}


<div className="
mb-8
flex
items-center
justify-between
">


<div>


<h1 className="
text-4xl
font-black
">

Seller Dashboard

</h1>


<p className="
mt-2
text-gray-500
">

Manage your Halo Marketplace business.

</p>


</div>





<form action={logout}>


<button

className="
rounded-xl
bg-red-500
px-5
py-3
font-bold
text-white
"

>

Logout

</button>


</form>



</div>









{/* SELLER PROFILE */}



<section className="
rounded-3xl
bg-black
p-8
text-white
">



<div className="
flex
flex-col
gap-6
md:flex-row
md:items-center
">





<div className="
relative
h-24
w-24
overflow-hidden
rounded-full
bg-gray-800
">


<Image

src={
profile.avatar ||
"/avatar.png"
}

alt="Seller"

fill

className="
object-cover
"

/>


</div>








<div>


<div className="
flex
items-center
gap-3
">


<h2 className="
text-3xl
font-black
">

{
profile.store_name ||
profile.username ||
"Your Store"
}

</h2>




{

profile.verified && (

<span className="
rounded-full
bg-green-500
px-3
py-1
text-xs
font-bold
">

✓ Verified

</span>


)

}



</div>





<p className="
mt-2
text-gray-300
">

📍 {profile.location || "Canada"}

</p>




<p className="
mt-3
max-w-xl
text-gray-300
">

{
profile.store_description ||
"Create your seller profile and start growing your marketplace business."
}

</p>



</div>




</div>


</section>









{/* ANALYTICS */}



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
shadow
">


<p className="
text-gray-500
">

Listings

</p>


<h3 className="
mt-2
text-4xl
font-black
">

{products.length}

</h3>


</div>







<div className="
rounded-3xl
bg-white
p-6
shadow
">


<p className="
text-gray-500
">

Views

</p>


<h3 className="
mt-2
text-4xl
font-black
">

{views}

</h3>


</div>







<div className="
rounded-3xl
bg-white
p-6
shadow
">


<p className="
text-gray-500
">

Favorites

</p>


<h3 className="
mt-2
text-4xl
font-black
">

{favorites}

</h3>


</div>







<div className="
rounded-3xl
bg-white
p-6
shadow
">


<p className="
text-gray-500
">

Rating

</p>


<h3 className="
mt-2
text-4xl
font-black
">

⭐ {profile.seller_rating || "5.0"}

</h3>


</div>





</section>








{/* ACTION BUTTONS */}



<section className="
mt-8
grid
gap-5
md:grid-cols-4
">



<Link

href="/sell"

className="
rounded-2xl
bg-indigo-600
p-6
text-center
text-xl
font-black
text-white
"

>

➕ Create Listing

</Link>





<Link

href="/messages"

className="
rounded-2xl
bg-black
p-6
text-center
text-xl
font-black
text-white
"

>

💬 Messages

</Link>





<Link

href={`/seller/${user.id}`}

className="
rounded-2xl
bg-white
p-6
text-center
text-xl
font-black
shadow
"

>

🏪 My Store

</Link>





<Link

href="/store/settings"

className="
rounded-2xl
bg-white
p-6
text-center
text-xl
font-black
shadow
"

>

⚙ Settings

</Link>




</section>
{/* ================= MY LISTINGS ================= */}


<section className="
mt-12
">


<div className="
mb-8
flex
items-center
justify-between
">


<div>

<h2 className="
text-3xl
font-black
">

My Listings

</h2>


<p className="
mt-2
text-gray-500
">

Manage your products and grow your sales.

</p>


</div>




<Link

href="/sell"

className="
rounded-xl
bg-black
px-6
py-3
font-bold
text-white
"

>

+ Add Product

</Link>



</div>







{

products.length === 0 ? (



<div className="
rounded-3xl
bg-white
p-12
text-center
shadow
">


<div className="
text-6xl
">

📦

</div>


<h3 className="
mt-5
text-2xl
font-black
">

No listings yet

</h3>



<p className="
mt-3
text-gray-500
">

Create your first Halo listing.

</p>




<Link

href="/sell"

className="
mt-6
inline-block
rounded-xl
bg-black
px-8
py-4
font-bold
text-white
"

>

Create Listing

</Link>


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



<div

key={product.id}

className="
overflow-hidden
rounded-3xl
bg-white
shadow
"

>







<Link

href={`/product/${product.slug}`}

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







<div className="
p-5
">


<h3 className="
truncate
font-black
">

{product.title}

</h3>



<p className="
mt-3
text-2xl
font-black
">

{formatPrice(product.price)}

</p>




<div className="
mt-3
flex
items-center
justify-between
">


<span className="
rounded-full
bg-gray-100
px-3
py-1
text-xs
font-bold
">

{
product.status ||
"active"
}

</span>





<span className="
text-xs
text-gray-500
">

{product.category}

</span>



</div>



</div>


</Link>








<div className="
flex
gap-2
border-t
p-5
">





<Link

href={`/product/edit/${product.slug}`}

className="
flex-1
rounded-xl
bg-gray-100
py-3
text-center
text-sm
font-bold
"

>

Edit

</Link>







<form

action={deleteProduct}

className="
flex-1
"

>


<input

type="hidden"

name="productId"

value={product.id}

/>




<button

className="
w-full
rounded-xl
bg-red-100
py-3
text-sm
font-bold
text-red-700
"

>

Delete

</button>



</form>





</div>







</div>



))

}





</div>




)

}





</section>









{/* ================= SELLER GROWTH ================= */}



<section className="
mt-12
rounded-3xl
bg-white
p-8
shadow
">



<div className="
grid
gap-8
md:grid-cols-2
">





<div>


<h2 className="
text-3xl
font-black
">

Grow Your Store 🚀

</h2>



<p className="
mt-4
text-gray-600
">

Unlock more visibility and reach more buyers with Halo Seller Pro.

</p>




<ul className="
mt-6
space-y-3
font-semibold
">


<li>
✓ Featured product placement
</li>


<li>
✓ Verified seller badge
</li>


<li>
✓ Seller analytics
</li>


<li>
✓ Priority support
</li>


</ul>



</div>






<div className="
rounded-3xl
bg-black
p-8
text-white
">


<h3 className="
text-2xl
font-black
">

Halo Pro Seller

</h3>



<p className="
mt-3
text-gray-300
">

Build your marketplace business.

</p>





<Link

href="/pricing"

className="
mt-6
inline-block
rounded-xl
bg-white
px-6
py-3
font-bold
text-black
"

>

Upgrade

</Link>



</div>





</div>



</section>





</div>


</main>


);

}
