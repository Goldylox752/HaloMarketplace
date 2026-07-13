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
const category = formData.get("category");
const condition = formData.get("condition");

const files = formData.getAll("images");



let uploadedImages = [];



for(const file of files){


if(file.size > 0){


const fileName =
`${user.id}/${Date.now()}-${file.name}`;



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

}=supabase.storage
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

category,

condition,

image:uploadedImages[0] || null,

images:uploadedImages,

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

encType="multipart/form-data"

className="mt-8 space-y-5"

>




<input

name="title"

required

placeholder="Product title"

className="w-full border rounded-xl p-4"

/>





<input

name="price"

required

type="number"

placeholder="Price CAD"

className="w-full border rounded-xl p-4"

/>






<input

name="location"

required

placeholder="City / Province"

className="w-full border rounded-xl p-4"

/>







<select

name="category"

required

className="w-full border rounded-xl p-4"

>


<option value="">

Choose Category

</option>


<option value="Vehicles">

🚗 Vehicles

</option>


<option value="Electronics">

📱 Electronics

</option>


<option value="Home">

🏠 Home

</option>


<option value="Fashion">

👕 Fashion

</option>


<option value="Gaming">

🎮 Gaming

</option>


<option value="Tools">

🛠 Tools

</option>


<option value="Sports">

⚽ Sports

</option>


<option value="Services">

💼 Services

</option>


</select>







<select

name="condition"

required

className="w-full border rounded-xl p-4"

>


<option value="">

Condition

</option>


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

required

rows="6"

placeholder="Describe your item..."

className="w-full border rounded-xl p-4"

/>







<label className="font-semibold">

Upload Photos

</label>




<input

name="images"

type="file"

multiple

accept="image/*"

required

className="w-full border rounded-xl p-4"

/>







<button

className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-xl text-lg font-bold"

>

Publish Listing

</button>




</form>



</div>


</div>


</main>


)

}
