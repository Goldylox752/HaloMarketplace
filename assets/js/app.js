/* =====================================
HALO MARKETPLACE
Production Marketplace Application JS
===================================== */


"use strict";


// =====================================
// CONFIG
// =====================================


const API_URL =
window.API_URL || "/api/v1";





// =====================================
// HELPERS
// =====================================


function escapeHTML(value){

return String(value ?? "")
.replace(/[&<>"']/g,function(char){

return {

"&":"&amp;",
"<":"&lt;",
">":"&gt;",
'"':"&quot;",
"'":"&#039;"

}[char];

});

}





function getJSON(key, fallback=[]){

try{

return JSON.parse(
localStorage.getItem(key)
) || fallback;


}

catch{

return fallback;

}

}





function saveJSON(key,value){

localStorage.setItem(
key,
JSON.stringify(value)
);

}





// =====================================
// TOAST SYSTEM
// =====================================


function showToast(message){


let toast =
document.getElementById("toast");



if(!toast){

toast =
document.createElement("div");

toast.id="toast";

document.body.appendChild(toast);

}



toast.textContent =
message;



toast.className =
"toast show";



setTimeout(()=>{

toast.className="toast";

},3000);


}







// =====================================
// SEARCH
// =====================================


function searchMarketplace(){


const input =
document.getElementById(
"searchInput"
);



if(!input) return;



const query =
input.value.trim();



if(!query){

showToast(
"Enter a product to search"
);

return;

}



window.location.href =

`/marketplace/browse.html?search=${encodeURIComponent(query)}`;


}







// =====================================
// PRODUCTS
// =====================================


async function loadProducts(){


const container =
document.getElementById(
"products"
);



if(!container)
return;



container.innerHTML =
"<p>Loading products...</p>";



try{


const response =
await fetch(
`${API_URL}/products`
);



if(!response.ok){

throw new Error(
"API error"
);

}



const data =
await response.json();



renderProducts(
data.products || []
);



}


catch(error){


console.error(
"Product loading error:",
error
);



container.innerHTML =
"<p>No products available</p>";



showToast(
"Failed loading products"
);


}


}








function renderProducts(products){


const container =
document.getElementById(
"products"
);



if(!container)
return;



container.innerHTML="";



products.forEach(product=>{


const card =

document.createElement("div");


card.className =
"product-card";



card.innerHTML = `

<img

src="${escapeHTML(
product.imageUrl ||
"/assets/default.png"
)}"

alt="${escapeHTML(product.title)}"

loading="lazy"

/>


<div class="product-content">


<h3>
${escapeHTML(product.title)}
</h3>


<p>
${escapeHTML(product.description)}
</p>


<strong>

$${Number(product.price).toFixed(2)}

</strong>



<button class="btn">

Add Cart

</button>


<button class="outline">

View

</button>


</div>

`;





card.querySelector(".btn")

.onclick = ()=>{

addToCart(product);

};



card.querySelector(".outline")

.onclick = ()=>{

viewProduct(product.id);

};



container.appendChild(card);



});


}








// =====================================
// CART
// =====================================


function getCart(){

return getJSON(
"halo_cart"
);

}





function addToCart(product){


let cart =
getCart();



const existing =

cart.find(
item =>
item.id === product.id
);



if(existing){

existing.quantity +=1;


}

else{


cart.push({

id:
product.id,

title:
product.title,

price:
Number(product.price),

image:
product.imageUrl,

quantity:1


});


}



saveJSON(
"halo_cart",
cart
);



showToast(

`${product.title} added to cart`

);



updateCartCount();


}







function removeCartItem(id){


let cart =
getCart();



cart =
cart.filter(

item =>
item.id !== id

);



saveJSON(
"halo_cart",
cart
);



updateCartCount();



showToast(
"Item removed"
);


}





function cartCount(){

return getCart()

.reduce(

(total,item)=>

total + item.quantity,

0

);

}





function updateCartCount(){


const element =

document.getElementById(
"cartCount"
);



if(element){

element.textContent =
cartCount();

}


}








// =====================================
// WISHLIST
// =====================================


function getWishlist(){

return getJSON(
"halo_wishlist"
);

}






function toggleWishlist(product){


let wishlist =
getWishlist();



const exists =

wishlist.some(

item =>
item.id === product.id

);



if(exists){


wishlist =

wishlist.filter(

item =>
item.id !== product.id

);


showToast(
"Removed from wishlist"
);


}

else{


wishlist.push(product);


showToast(
"Added to wishlist"
);


}



saveJSON(
"halo_wishlist",
wishlist
);


}









// =====================================
// AUTH
// =====================================


function getUser(){

return getJSON(
"halo_user",
null
);

}




function checkUser(){


const user =
getUser();



if(user){

console.log(
"User:",
user.email
);


return user;

}



return null;


}








// =====================================
// NAVIGATION
// =====================================


function viewProduct(id){


window.location.href =

`/marketplace/product.html?id=${encodeURIComponent(id)}`;


}





function openStore(id){


window.location.href =

`/marketplace/vendor.html?id=${encodeURIComponent(id)}`;


}








// =====================================
// CHECKOUT
// =====================================


async function checkout(){


const cart =
getCart();



if(!cart.length){

showToast(
"Your cart is empty"
);

return;

}



try{


const response =

await fetch(

`${API_URL}/orders`,

{

method:"POST",

headers:{

"Content-Type":
"application/json"

},


body:JSON.stringify({

items:cart

})


}

);




const data =
await response.json();



if(data.success){


window.location.href =

`/checkout/checkout.html?order=${data.orderId}`;


}

else{


throw new Error(
"Checkout failed"
);


}


}


catch(error){


console.error(error);


showToast(
"Checkout failed"
);


}


}







// =====================================
// MOBILE MENU
// =====================================


function toggleMenu(){


const nav =
document.querySelector(
"nav"
);



if(nav){

nav.classList.toggle(
"open"
);

}


}







// =====================================
// START APP
// =====================================


document.addEventListener(

"DOMContentLoaded",

()=>{


loadProducts();


checkUser();


updateCartCount();


}

);
