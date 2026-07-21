import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";



async function getProduct(id){


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
data:product,
error

} = await supabase

.from("products")

.select("*")

.eq("id", id)

.eq("seller_id", user.id)

.single();





if(error || !product){

return null;

}



return product;

}








export const metadata = {

title:"Edit Listing | Halo Marketplace"

};







export default async function EditListingPage({params}){


const {id} = await params;



const product = await getProduct(id);





if(!product){

notFound();

}






async function updateListing(formData){

"use server";



const supabase = await createClient();



const {
data:{
user
}

} = await supabase.auth.getUser();




if(!user){

redirect("/login");

}





const updateData = {


title:
formData.get("title"),


description:
formData.get("description"),


price:
Number(formData.get("price")),


location:
formData.get("location"),


category:
formData.get("category"),


condition:
formData.get("condition"),


status:
formData.get("status")

};







const {
error

}= await supabase

.from("products")

.update(updateData)

.eq(
"id",
id
)

.eq(
"seller_id",
user.id
);





if(error){

console.log(error);

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

Edit Listing

</h1>


<p className="
mt-3
text-gray-600
">

Update your Halo Marketplace product.

</p>





<form

action={updateListing}

className="
mt-10
space-y-5
"

>



<input

name="title"

defaultValue={product.title}

placeholder="Title"

required

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

defaultValue={product.price}

placeholder="Price"

required

className="
w-full
rounded-xl
border
p-4
"

/>







<input

name="location"

defaultValue={product.location}

placeholder="Location"

required

className="
w-full
rounded-xl
border
p-4
"

/>







<select

name="category"

defaultValue={product.category}

className="
w-full
rounded-xl
border
p-4
"

>

<option value="Electronics">
Electronics
</option>

<option value="Vehicles">
Vehicles
</option>

<option value="Computers">
Computers
</option>

<option value="Home">
Home
</option>

<option value="Gaming">
Gaming
</option>

<option value="Other">
Other
</option>


</select>







<select

name="condition"

defaultValue={product.condition}

className="
w-full
rounded-xl
border
p-4
"

>

<option value="New">
New
</option>

<option value="Like New">
Like New
</option>

<option value="Used">
Used
</option>

<option value="Refurbished">
Refurbished
</option>


</select>








<select

name="status"

defaultValue={product.status}

className="
w-full
rounded-xl
border
p-4
"

>

<option value="active">
Active
</option>

<option value="sold">
Sold
</option>

<option value="hidden">
Hidden
</option>


</select>







<textarea

name="description"

defaultValue={product.description}

rows="6"

placeholder="Description"

className="
w-full
rounded-xl
border
p-4
"

/>








<button

type="submit"

className="
w-full
rounded-xl
bg-black
py-4
font-bold
text-white
"

>

Save Changes

</button>





</form>



</div>



</div>



</main>

);

}