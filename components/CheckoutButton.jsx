"use client";


import {useState} from "react";



export default function CheckoutButton({

productId

}){


const [loading,setLoading]=useState(false);




async function checkout(){


setLoading(true);



const response = await fetch(

"/api/checkout",

{

method:"POST",

headers:{

"Content-Type":"application/json"

},

body:JSON.stringify({

productId

})

}

);



const data = await response.json();



if(data.url){

window.location.href=data.url;

}



setLoading(false);



}






return (

<button

onClick={checkout}

disabled={loading}

className="w-full bg-black text-white py-4 rounded-xl font-bold text-lg"

>

{

loading

?

"Loading..."

:

"Buy Now"

}


</button>

)


}
