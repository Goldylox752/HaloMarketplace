"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";


export async function createAIListing(formData){

const supabase = await createClient();



const {
data:{
user
}

}=await supabase.auth.getUser();



if(!user){

redirect("/login");

}



const title =
formData.get("title")?.toString();


const description =
formData.get("description")?.toString();


const category =
formData.get("category")?.toString();


const price =
formData.get("price")?.toString();


const image =
formData.get("image")?.toString();





const slug = title
.toLowerCase()
.replace(/[^a-z0-9]+/g,"-")
.replace(/(^-|-$)/g,"");






const {
error
}=await supabase
.from("products")
.insert({

user_id:user.id,

title,

description,

category,

price:Number(price),

image,

slug,

status:"active",

ai_generated:true

});





if(error){

console.error(error);

throw new Error(
"Could not create listing"
);

}





redirect("/dashboard");


}