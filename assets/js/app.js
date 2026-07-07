/* =====================================
HALO MARKETPLACE
Application JavaScript
===================================== */


// ===============================
// SEARCH
// ===============================


function searchMarketplace(){


const input =
document.getElementById("searchInput");


if(!input) return;



const query =
input.value.trim();



if(query){


window.location.href =

"/marketplace/browse.html?search=" +

encodeURIComponent(query);



}else{


showToast(
"Enter a product to search"
);


}


}





// ===============================
// CART SYSTEM
// ===============================


function getCart(){


return JSON.parse(

localStorage.getItem("halo_cart")

) || [];


}




function addToCart(product){


let cart = getCart();



cart.push({

product,

quantity:1,

added:new Date()

});



localStorage.setItem(

"halo_cart",

JSON.stringify(cart)

);



showToast(

product + " added to cart"

);



}





function cartCount(){


const cart = getCart();


return cart.length;


}





// ===============================
// WISHLIST
// ===============================


function toggleWishlist(product){


let wishlist = JSON.parse(

localStorage.getItem("halo_wishlist")

) || [];




if(wishlist.includes(product)){


wishlist = wishlist.filter(

item => item !== product

);


showToast(
"Removed from wishlist"
);



}else{


wishlist.push(product);


showToast(
"Added to wishlist"
);


}



localStorage.setItem(

"halo_wishlist",

JSON.stringify(wishlist)

);



}





// ===============================
// AUTH STATE
// ===============================


function checkUser(){


/*

Supabase integration:

supabase.auth.getUser()

will replace this

*/



const user =

localStorage.getItem(
"halo_user"
);



if(user){


console.log(
"User logged in"
);


}else{


console.log(
"Guest user"
);


}



}




// ===============================
// PRODUCT VIEW
// ===============================


function viewProduct(id){


window.location.href =

"/marketplace/product.html?id=" +

id;


}





// ===============================
// SELLER STORE
// ===============================


function openStore(id){


window.location.href =

"/marketplace/vendor.html?id=" +

id;


}





// ===============================
// CHECKOUT
// ===============================


function checkout(){



const cart = getCart();



if(cart.length === 0){


showToast(
"Your cart is empty"
);


return;


}




/*

Backend:

POST /api/payments/create-checkout

Stripe creates session

*/



window.location.href =

"/checkout/checkout.html";



}





// ===============================
// TOAST
// ===============================


function showToast(message){



let toast =

document.getElementById(
"toast"
);



if(!toast){


toast =
document.createElement(
"div"
);


toast.id="toast";


document.body.appendChild(
toast
);


}



toast.innerHTML = message;



toast.className =
"toast show";



setTimeout(()=>{


toast.className =
"toast";


},2500);



}





// ===============================
// MOBILE MENU
// ===============================


function toggleMenu(){


const nav =
document.querySelector("nav");


if(nav){


nav.classList.toggle(
"open"
);


}



}





// ===============================
// INIT
// ===============================


document.addEventListener(

"DOMContentLoaded",

()=>{


checkUser();



}

);