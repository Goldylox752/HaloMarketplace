"use client";

import { useState } from "react";


export default function CheckoutButton({ productId }) {


const [loading,setLoading] = useState(false);



async function checkout(){


try{


setLoading(true);



const response = await fetch(
"/api/checkout",
{
method:"POST",

headers:{
"Content-Type":"application/json",
},

body:JSON.stringify({

productId,

}),

}
);



const data = await response.json();



if(data.url){

window.location.href = data.url;

}else{

alert(
"Unable to start checkout."
);

}



}catch(error){


console.error(error);

alert(
"Checkout failed."
);


}finally{


setLoading(false);


}


}





return (

<button

onClick={checkout}

disabled={loading}

className="w-full rounded-xl bg-indigo-600 py-4 font-bold text-white transition hover:bg-indigo-700"

>


{loading ? "Processing..." : "Buy Now"}


</button>


);


}