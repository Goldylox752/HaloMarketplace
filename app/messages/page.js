import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";



async function getMessages(){


const supabase = await createClient();



const {
data:{
user
}

} = await supabase.auth.getUser();





if(!user){

redirect("/login");

}





const {
data:messages,
error

} = await supabase

.from("messages")

.select(`
id,
message,
sender_id,
receiver_id,
created_at
`)

.or(
`sender_id.eq.${user.id},receiver_id.eq.${user.id}`
)

.order(
"created_at",
{
ascending:false
}
);





if(error){

console.log(
"Messages error:",
error
);

return {

user,

messages:[]

};

}





return {

user,

messages:messages || []

};


}







export const metadata = {

title:"Messages | Halo Marketplace",

description:
"Chat with buyers and sellers on Halo Marketplace."

};








export default async function MessagesPage(){


const {

user,

messages

}= await getMessages();





return (

<main className="
min-h-screen
bg-gray-50
px-6
py-16
">



<div className="
mx-auto
max-w-5xl
">



<div className="
rounded-3xl
bg-white
p-10
shadow
">





<h1 className="
text-4xl
font-black
">

💬 Messages

</h1>



<p className="
mt-3
text-gray-600
">

Your conversations with Halo Marketplace users.

</p>








<section className="
mt-10
space-y-4
">



{
messages.length === 0 ? (


<div className="
rounded-2xl
bg-gray-100
p-10
text-center
">


<h2 className="
text-2xl
font-bold
">

No messages yet

</h2>


<p className="
mt-3
text-gray-500
">

When buyers or sellers contact you, messages will appear here.

</p>



</div>



):(



messages.map((msg)=>(


<div

key={msg.id}

className={`
rounded-2xl
p-5
${
msg.sender_id === user.id

?

"bg-black text-white ml-auto"

:

"bg-gray-100"

}
max-w-xl
`}

>


<p className="font-medium">

{msg.message}

</p>



<p className="
mt-3
text-xs
opacity-70
">

{
new Date(
msg.created_at
).toLocaleString()
}

</p>



</div>


))



)

}



</section>





</div>


</div>


</main>

);

}