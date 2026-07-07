<!-- register.html -->

<!DOCTYPE html>
<html lang="en">

<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<title>Create Account | Halo Marketplace</title>

<style>

* {
    box-sizing:border-box;
    font-family:Arial, sans-serif;
}


body {
    background:#f5f7fb;
    height:100vh;
    display:flex;
    align-items:center;
    justify-content:center;
}


.auth-card {

    width:400px;
    background:white;
    padding:35px;
    border-radius:18px;
    box-shadow:0 10px 30px rgba(0,0,0,.12);

}


h1 {
    text-align:center;
    margin-bottom:10px;
}


.subtitle {
    text-align:center;
    color:#666;
    margin-bottom:25px;
}


input,
select {

    width:100%;
    padding:14px;
    margin-bottom:12px;
    border:1px solid #ddd;
    border-radius:8px;

}



button {

    width:100%;
    padding:14px;
    border:none;
    border-radius:8px;
    background:#111827;
    color:white;
    font-size:16px;
    cursor:pointer;

}


button:hover {

    opacity:.9;

}


.message {

    text-align:center;
    margin-top:15px;

}


.error {

    color:red;

}


.success {

    color:green;

}

</style>

</head>


<body>


<div class="auth-card">


<h1>
Join Halo Marketplace
</h1>


<div class="subtitle">
Create your buyer or seller account
</div>



<input 
id="name"
type="text"
placeholder="Full name"
/>



<input 
id="email"
type="email"
placeholder="Email address"
/>



<input 
id="password"
type="password"
placeholder="Password"
/>



<select id="role">

<option value="buyer">
Buyer
</option>


<option value="seller">
Seller
</option>


</select>



<button onclick="register()">

Create Account

</button>



<div id="message" class="message"></div>


</div>



<script type="module">


import { createClient } 
from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";



const supabaseUrl =
"YOUR_SUPABASE_URL";


const supabaseKey =
"YOUR_SUPABASE_ANON_KEY";



const supabase =
createClient(
supabaseUrl,
supabaseKey
);




window.register = async function(){



const name =
document.getElementById("name").value;


const email =
document.getElementById("email").value;


const password =
document.getElementById("password").value;


const role =
document.getElementById("role").value;



const message =
document.getElementById("message");



if(!name || !email || !password){

message.className =
"message error";

message.innerHTML =
"Please complete all fields";

return;

}




// Create authentication account

const {
data,
error
} =
await supabase.auth.signUp({

email,
password,

options:{

data:{

full_name:name,
role:role

}

}

});



if(error){

message.className =
"message error";

message.innerHTML =
error.message;

return;

}




// Create profile record

const {

error:profileError

} =
await supabase
.from("profiles")
.insert({

id:data.user.id,

email,

full_name:name,

role

});




if(profileError){

console.log(profileError);

}




message.className =
"message success";


message.innerHTML =
"Account created! Check your email verification.";



}



</script>


</body>

</html>