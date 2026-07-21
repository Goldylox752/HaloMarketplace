"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";


export async function deleteListing(id){


const supabase = await createClient();



const {
data:{
user
}

}= await supabase.auth.getUser();



if(!user){

redirect("/login");

}





const {error} = await supabase

.from("products")

.delete()

.eq("id", id)

.eq("seller_id", user.id);





if(error){

console.log("Delete error:", error);

return;

}



redirect("/seller/dashboard");


}