import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";




async function getOrder(id){


const supabase =
await createClient();



const {
data:{
user
}

}=await supabase.auth.getUser();



if(!user){

redirect("/login");

}






const {
data:order,
error

}=await supabase

.from("orders")

.select(`

id,

amount,

status,

payment_status,

tracking_number,

delivered,

created_at,


product:products(

id,

title,

image,

slug,

location

),



seller:profiles!orders_seller_id_fkey(

id,

username,

avatar,

verified

)

`)

.eq(
"id",
id
)

.eq(
"buyer_id",
user.id
)

.single();






if(error || !order){

return null;

}



return order;


}






function formatPrice(price){

return new Intl.NumberFormat(
"en-CA",
{
style:"currency",
currency:"CAD"
}

).format(price || 0);

}







function StatusBadge({
status
}){


const styles = {

paid:
"bg-green-100 text-green-700",

processing:
"bg-blue-100 text-blue-700",

shipped:
"bg-purple-100 text-purple-700",

delivered:
"bg-green-100 text-green-700",

pending:
"bg-yellow-100 text-yellow-700"

};



return (

<span

className={`
rounded-full
px-4
py-2
text-sm
font-bold
${styles[status] || styles.pending}
`}

>

{status}

</span>

);


}







export async function generateMetadata({
params
}){


const {
id
}=await params;


const order =
await getOrder(id);



return {

title:

order

?

`Order ${order.id} | Halo Marketplace`

:

"Order Not Found"

};


}








export default async function OrderPage({
params
}){


const {
id
}=await params;



const order =
await getOrder(id);



if(!order){

notFound();

}





return (

<main className="
min-h-screen
bg-gray-50
px-6
py-12
">



<div className="
mx-auto
max-w-5xl
">






<section className="
rounded-3xl
bg-white
p-8
shadow-sm
">


<div className="
flex
justify-between
items-center
gap-4
flex-wrap
">


<div>

<h1 className="
text-4xl
font-black
">

Your Order

</h1>


<p className="
mt-2
text-gray-500
">

Order #{order.id}

</p>


</div>





<StatusBadge

status={
order.status
}

/>


</div>



</section>









<section className="
mt-8
grid
gap-8
md:grid-cols-2
">






{/* PRODUCT */}


<div className="
rounded-3xl
bg-white
p-8
">


<h2 className="
text-2xl
font-black
">

Item

</h2>



<div className="
mt-6
flex
gap-5
">


<div className="
relative
h-28
w-28
overflow-hidden
rounded-xl
bg-gray-100
">


{

order.product?.image &&

<Image

src={order.product.image}

alt={order.product.title}

fill

className="
object-cover
"

/>

}


</div>





<div>


<h3 className="
text-xl
font-black
">

{order.product?.title}

</h3>


<p className="
mt-2
text-gray-500
">

📍 {order.product?.location}

</p>



<p className="
mt-3
text-2xl
font-black
">

{formatPrice(order.amount)}

</p>


</div>


</div>



<Link

href={`/product/${order.product?.slug}`}

className="
mt-6
block
rounded-xl
border
py-3
text-center
font-bold
"

>

View Product

</Link>


</div>









{/* DELIVERY */}



<div className="
rounded-3xl
bg-white
p-8
">


<h2 className="
text-2xl
font-black
">

Delivery

</h2>




<div className="
mt-6
space-y-4
">


<div>

<p className="
text-gray-500
">

Payment

</p>


<p className="
font-bold
">

{order.payment_status}

</p>


</div>





<div>

<p className="
text-gray-500
">

Tracking Number

</p>


<p className="
font-bold
">

{
order.tracking_number
||
"Not shipped yet"
}

</p>


</div>






<div>

<p className="
text-gray-500
">

Delivered

</p>


<p className="
font-bold
">

{
order.delivered
?
"Yes ✅"
:
"No"

}

</p>


</div>



</div>


</div>



</section>









{/* SELLER */}



<section className="
mt-8
rounded-3xl
bg-white
p-8
">


<h2 className="
text-2xl
font-black
">

Seller

</h2>



<div className="
mt-5
flex
items-center
gap-4
">


{

order.seller?.avatar &&

<Image

src={order.seller.avatar}

width={60}

height={60}

alt="Seller"

className="
rounded-full
"

/>

}




<div>

<h3 className="
font-black
text-xl
">

{order.seller?.username}

</h3>


{

order.seller?.verified &&

<p className="
text-green-600
font-bold
">

✓ Verified Seller

</p>

}


</div>


</div>


</section>







<section className="
mt-8
rounded-3xl
bg-black
p-8
text-white
text-center
">


<h2 className="
text-3xl
font-black
">

🛡️ Halo Buyer Protection

</h2>


<p className="
mt-3
text-gray-300
">

Your payment is protected until your order is completed.

</p>


</section>







</div>


</main>

);

}