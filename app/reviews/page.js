import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";



async function getReviews(){


const supabase = await createClient();



const {
data:{
user
}

}=await supabase.auth.getUser();




if(!user){

redirect("/login");

}





const {

data:reviews,

error

}=await supabase

.from("reviews")

.select(`

*,

products(

id,

title,

image

)

`)

.eq(

"user_id",

user.id

)

.order(

"created_at",

{

ascending:false

}

);






if(error){

console.log(error);

return [];

}





return reviews || [];

}








function formatDate(date){


return new Date(date).toLocaleDateString(

"en-CA"

);


}








export default async function ReviewsPage(){


const reviews = await getReviews();





return (

<main className="min-h-screen bg-gray-50 py-12 px-6">



<div className="max-w-5xl mx-auto">





<h1 className="text-5xl font-black">

My Reviews

</h1>





<p className="text-gray-500 mt-3">

Your Halo marketplace feedback history.

</p>







<div className="mt-10 space-y-6">





{

reviews.length === 0 ? (



<div className="bg-white rounded-3xl shadow p-10 text-center">


<h2 className="text-2xl font-bold">

No reviews yet

</h2>



<p className="text-gray-500 mt-3">

Complete a purchase to leave your first review.

</p>



</div>



):(



reviews.map((review)=>(



<div

key={review.id}

className="bg-white rounded-3xl shadow p-8"

>





<h2 className="text-xl font-bold">

{review.products?.title || "Product"}

</h2>






<div className="mt-4 text-yellow-500 text-2xl">

{"⭐".repeat(review.rating || 0)}

</div>







<p className="mt-4 text-gray-600">

{review.comment || "No comment provided."}

</p>






<p className="mt-5 text-sm text-gray-400">

Posted {formatDate(review.created_at)}

</p>






</div>



))


)



}



</div>





</div>



</main>

)

}
