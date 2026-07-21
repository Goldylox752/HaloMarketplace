import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";


export const metadata = {

title:"Halo AI Listing Creator",

description:
"Create professional marketplace listings instantly with Halo AI."

};





export default async function AIListingPage(){


const supabase =
await createClient();



const {
data:{
user
}

}=await supabase.auth.getUser();



if(!user){

redirect("/login");

}



return (

<main className="
min-h-screen
bg-gray-50
px-6
py-16
">



<div className="
mx-auto
max-w-6xl
">





<section className="
rounded-[40px]
bg-gradient-to-br
from-black
via-gray-900
to-gray-800
p-12
text-white
">


<div className="
inline-flex
rounded-full
bg-white/10
px-5
py-2
font-bold
">

🤖 Halo AI Marketplace Assistant

</div>




<h1 className="
mt-8
text-5xl
font-black
md:text-7xl
">

Sell Faster
With AI

</h1>




<p className="
mt-6
max-w-3xl
text-xl
text-gray-300
">

Halo AI creates optimized marketplace listings,
suggests pricing, improves descriptions and helps
your products sell faster.

</p>




<div className="
mt-8
flex
gap-4
flex-wrap
">


<div className="
rounded-xl
bg-white/10
px-5
py-3
font-bold
">

⚡ 10x Faster Listings

</div>


<div className="
rounded-xl
bg-white/10
px-5
py-3
font-bold
">

🇨🇦 Canada Marketplace

</div>


</div>



</section>








<section className="
mt-10
grid
gap-8
lg:grid-cols-2
">






{/* INPUT */}



<div className="
rounded-3xl
bg-white
p-10
shadow
">


<h2 className="
text-3xl
font-black
">

Product Details

</h2>



<form

action="/api/ai-listing"

method="POST"

className="
mt-8
space-y-5
"

>




<input

name="product"

required

placeholder="
Product name
"

className="
w-full
rounded-xl
border
px-5
py-4
"

/>





<select

name="condition"

className="
w-full
rounded-xl
border
px-5
py-4
"

>


<option>
New
</option>

<option>
Like New
</option>

<option>
Good
</option>

<option>
Used
</option>


</select>








<textarea

name="details"

rows="6"

placeholder="
Brand, model, features, accessories...
"

className="
w-full
rounded-xl
border
px-5
py-4
"

/>







<input

name="image"

placeholder="
Image URL
"

className="
w-full
rounded-xl
border
px-5
py-4
"

/>








<button

className="
w-full
rounded-xl
bg-black
py-4
font-black
text-white
hover:bg-gray-800
"

>

✨ Generate Listing

</button>



</form>


</div>









{/* AI PREVIEW */}



<div className="
rounded-3xl
bg-white
p-10
shadow
">


<h2 className="
text-3xl
font-black
">

AI Preview

</h2>



<div className="
mt-8
rounded-3xl
bg-gray-100
p-8
text-center
">


<div className="
text-6xl
">

🤖

</div>



<h3 className="
mt-5
text-xl
font-bold
">

Your AI listing will appear here

</h3>



<p className="
mt-3
text-gray-500
">

Halo AI will generate:

</p>




<ul className="
mt-5
space-y-3
text-left
">

<li>
✅ Professional title
</li>

<li>
✅ Sales description
</li>

<li>
✅ Suggested price
</li>

<li>
✅ Category
</li>

<li>
✅ Search keywords
</li>


</ul>


</div>



</div>



</section>








<section className="
mt-10
grid
gap-6
md:grid-cols-4
">


{[

["📝","AI Titles"],
["💰","Smart Pricing"],
["🔎","SEO Search"],
["🚀","More Sales"]

].map(feature=>(


<div

key={feature[1]}

className="
rounded-3xl
bg-white
p-7
text-center
shadow-sm
"

>


<div className="
text-5xl
">

{feature[0]}

</div>


<h3 className="
mt-4
font-black
">

{feature[1]}

</h3>


</div>


))}


</section>







<div className="
mt-10
text-center
">


<Link

href="/sell"

className="
font-bold
text-indigo-600
"

>

← Back to Sell

</Link>


</div>




</div>


</main>

);


}