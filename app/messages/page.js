import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Chat from "@/components/Chat";



export default async function MessagesPage(){


const supabase = await createClient();



const {
data:{
user
}

}=await supabase.auth.getUser();



if(!user){

redirect("/login");

}




const {data:messages}=await supabase

.from("messages")

.select("*")

.or(
`sender_id.eq.${user.id},receiver_id.eq.${user.id}`
)

.order(
"created_at",
{
ascending:true
}
);





return (

<main className="min-h-screen bg-gray-50 py-12 px-6">


<div className="max-w-5xl mx-auto">


<div className="bg-white rounded-3xl shadow p-8">


<h1 className="text-4xl font-bold">

Messages

</h1>


<Chat

user={user}

initialMessages={messages || []}

/>


</div>


</div>


</main>

)

}
