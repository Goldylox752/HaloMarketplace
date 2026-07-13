import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";



export default function SellPage(){



async function createProduct(formData){

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




const title = formData.get("title");
const description = formData.get("description");
const price = formData.get("price");
const location = formData.get("location");
const condition = formData.get("condition");

const files = formData.getAll("images");



let uploadedImages = [];



for(const file of files){


if(file.size > 0){


const fileName =
`${user.id}-${Date.now()}-${file.name}`;



const {
data,
error
}=await supabase.storage
.from("product-images")
.upload(
fileName,
file,
{
contentType:file.type
}
);



if(error){

console.log(error);

continue;

}




const {
data:{
publicUrl
}

}
=
supabase.storage
.from("product-images")
.getPublicUrl(
data.path
);



uploadedImages.push(publicUrl);



}



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

images:uploadedImages,

image:uploadedImages[0] || null,

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

Create Listing

</h1>


<p className="text-gray-500 mt-3">

Sell your products across Canada.

</p>




<form
action={createProduct}
className="mt-8 space-y-5"
encType="multipart/form-data"
>




<input

name="title"

placeholder="Product title"

className="w-full border rounded-xl p-4"

/>





<input

name="price"

type="number"

placeholder="Price CAD"

className="w-full border rounded-xl p-4"

/>






<input

name="location"

placeholder="City / Province"

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






<textarea

name="description"

placeholder="Describe your product"

rows="6"

className="w-full border rounded-xl p-4"

/>







<label className="block font-semibold">

Product Photos

</label>



<input

name="images"

type="file"

multiple

accept="image/*"

className="w-full border rounded-xl p-4"

/>







<button

className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-indigo-700"

>

Publish Listing

</button>




</form>



</div>


</div>


</main>


)


}
