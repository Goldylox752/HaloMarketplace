"use client";


export default function CheckoutButton({product}){


async function checkout(){


const response =
await fetch(
"/api/checkout",
{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({
product
})
}
);


const data =
await response.json();


window.location.href=data.url;


}



return (

<button

onClick={checkout}

className="
w-full
bg-black
text-white
py-4
rounded-xl
font-bold
"

>

Buy Now

</button>

)

}
