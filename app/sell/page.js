import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";



function createSlug(text){

return text

.toLowerCase()

.trim()

.replace(/[^a-z0-9]+/g,"-")

.replace(/^-+|-+$/g,"");

}





export const metadata = {

title:"Sell Item | Halo Marketplace",

description:
"Create a listing and sell on Halo Marketplace."

};







export default function SellPage(){





async function createProduct(formData){

"use server";



const supabase = await createClient();




const {
data:{
user
}

}= await supabase.auth.getUser();





if(!user){

redirect("/login");

}







const title = formData.get("title")?.toString();

const description = formData.get("description")?.toString();

const price = Number(formData.get("price"));

const location = formData.get("location")?.toString();

const category = formData.get("category")?.toString();

const condition = formData.get("condition")?.toString();





if(!title || !price || !location){

return;

}







const files = formData.getAll("images");



let uploadedImages = [];






for(const file of files){



if(file instanceof File && file.size > 0){



const filePath =

`${user.id}/${crypto.randomUUID()}-${file.name}`;





const {

data,

error

}= await supabase.storage

.from("product-images")

.upload(

filePath,

file,

{

contentType:file.type

}

);





if(error){

console.log(
"Upload error:",
error
);

continue;

}






const {

data:{
publicUrl

}

}= supabase.storage

.from("product-images")

.getPublicUrl(
data.path
);





uploadedImages.push(publicUrl);



}



}







const slug =

`${createSlug(title)}-${Date.now()}`;






const {

error

}= await supabase

.from("products")

.insert({

seller_id:user.id,

title,

slug,

description,

price,

location,

category,

condition,

image:
uploadedImages[0] || null,

images:
uploadedImages,

status:"active"

});






if(error){

console.log(
"Product error:",
error
);

return;

}





redirect("/seller/dashboard");



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
max-w-3xl
">



<div className="
rounded-3xl
bg-white
p-10
shadow
">





<h1 className="
text-4xl
font-black
">

Sell on Halo Marketplace

</h1>




<p className="
mt-3
text-gray-600
">

Create your listing and connect with buyers.

</p>







<form

action={createProduct}

encType="multipart/form-data"

className="
mt-10
space-y-5
"

>







<input

name="title"

required

placeholder="Product title"

className="
w-full
rounded-xl
border
p-4
"

/>







<input

name="price"

type="number"

required

placeholder="Price CAD"

className="
w-full
rounded-xl
border
p-4
"

/>







<input

name="location"

required

placeholder="City / Province"

className="
w-full
rounded-xl
border
p-4
"

/>







<select

name="category"

required

className="
w-full
rounded-xl
border
p-4
"

>


<option value="">
Select Category
</option>


<option>
Vehicles
</option>


<option>
Electronics
</option>


<option>
Computers
</option>


<option>
Home
</option>


<option>
Fashion
</option>


<option>
Gaming
</option>


<option>
Tools
</option>


<option>
Sports
</option>


<option>
Services
</option>


</select>







<select

name="condition"

required

className="
w-full
rounded-xl
border
p-4
"

>


<option value="">
Select Condition
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

className="
w-full
rounded-xl
border
p-4
"

/>







<label className="
font-bold
">

Photos

</label>






<input

name="images"

type="file"

multiple

accept="image/*"

required

className="
w-full
rounded-xl
border
p-4
"

/>







<button

className="
w-full
rounded-xl
bg-black
py-4
font-bold
text-white
hover:bg-gray-800
"

>

Publish Listing

</button>






</form>






</div>


</div>


</main>

);

}