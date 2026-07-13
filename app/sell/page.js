import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";


export default function SellPage(){


async function createProduct(formData){


"use server";


const supabase = await createClient();



const title = formData.get("title");
const description = formData.get("description");
const price = formData.get("price");
const location = formData.get("location");
const condition = formData.get("condition");
const image = formData.get("image");



const {
data:{
user
}

} = await supabase.auth.getUser();



if(!user){

redirect("/login");

}





const {error}=await supabase
.from("products")
.insert({

seller_id:user.id,

title,

description,

price:Number(price),

location,

condition,

image,

created_at:new Date()

});




if(error){

console.log(error);

return;

}



redirect("/products");


}



return (

<main className="min-h-screen bg-gray-50 py-16 px-6">


<div className="max-w-3xl mx-auto">


<div className="bg-white rounded-3xl shadow p-10">


<h1 className="text-4xl font-bold">

Sell on Halo Marketplace

</h1>


<p className="text-gray-500 mt-3">

Create your listing and reach buyers across Canada.

</p>




<form
action={createProduct}
className="mt-8 space-y-5"
>




<input

name="title"

placeholder="Product title"

className="w-full border rounded-xl p-4"

/>




<input

name="price"

placeholder="Price CAD"

type="number"

className="w-full border rounded-xl p-4"

/>





<input

name="location"

placeholder="Location"

className="w-full border rounded-xl p-4"

/>






<select

name="condition"

className="w-full border rounded-xl p-4"

>


<option>
New
</option>


<option>
Like New
</option>


<option>
Used
</option>


<option>
Refurbished
</option>


</select>







<input

name="image"

placeholder="Image URL"

className="w-full border rounded-xl p-4"

/>







<textarea

name="description"

placeholder="Describe your product"

rows="6"

className="w-full border rounded-xl p-4"

/>







<button

className="w-full bg-indigo-600 text-white py-4 rounded-xl text-lg font-bold hover:bg-indigo-700"

>

Publish Listing

</button>




</form>


</div>


</div>


</main>


)

}
