"use client";


import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";



export default function FavoriteButton({productId}){


const [saved,setSaved]=useState(false);

const [loading,setLoading]=useState(false);



const supabase=createClient();





useEffect(()=>{


async function checkFavorite(){


const {
data:{
user
}

}=await supabase.auth.getUser();



if(!user){

return;

}



const {data}=await supabase

.from("favorites")

.select("id")

.eq("user_id",user.id)

.eq("product_id",productId)

.single();





if(data){

setSaved(true);

}


}



checkFavorite();



},[]);








async function toggleFavorite(){


setLoading(true);



const {
data:{
user
}

}=await supabase.auth.getUser();



if(!user){

window.location.href="/login";

return;

}





if(saved){



await supabase

.from("favorites")

.delete()

.eq("user_id",user.id)

.eq("product_id",productId);



setSaved(false);



}else{



await supabase

.from("favorites")

.insert({

user_id:user.id,

product_id:productId

});



setSaved(true);



}




setLoading(false);



}







return (

<button

onClick={toggleFavorite}

disabled={loading}

className={`w-full py-4 rounded-xl font-bold text-lg transition

${

saved

?

"bg-red-500 text-white"

:

"bg-black text-white"

}

`}

>


{

saved

?

"❤️ Saved"

:

"♡ Save Listing"

}



</button>


)

}
