import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Chat from "@/components/Chat";
import { getOrCreateConversation } from "@/app/actions/messaging";




// ===============================
// GET USER CONVERSATIONS
// ===============================


async function getConversations(userId){


const supabase =
await createClient();



const {
data,
error
}=await supabase

.from("conversations")

.select(`

id,

user1_id,

user2_id,

last_message,

last_message_at,


user1:profiles!conversations_user1_id_fkey(

username,

avatar,

verified

),


user2:profiles!conversations_user2_id_fkey(

username,

avatar,

verified

)

`)

.or(
`user1_id.eq.${userId},user2_id.eq.${userId}`
)

.order(
"last_message_at",
{
ascending:false
}
);







if(error){

console.error(
"Conversation error:",
error
);

return [];

}






return data.map(conv=>{


const isUser1 =
conv.user1_id === userId;



const profile =
isUser1
?
conv.user2
:
conv.user1;



const otherUserId =
isUser1
?
conv.user2_id
:
conv.user1_id;





return {

id:conv.id,

otherUserId,


username:
profile?.username || "Halo User",


avatar:
profile?.avatar || "/avatar.png",


verified:
profile?.verified || false,


lastMessage:
conv.last_message ||
"Start conversation",


lastMessageAt:
conv.last_message_at

};



});

}





// ===============================
// GET CHAT MESSAGES
// ===============================


async function getMessagesForConversation(
userId,
otherUserId
){


const supabase =
await createClient();




const [
first,
second
]=[
userId,
otherUserId
].sort();






const {
data:conversation
}=await supabase

.from("conversations")

.select("id")

.eq(
"user1_id",
first
)

.eq(
"user2_id",
second
)

.maybeSingle();







if(!conversation){

return {

messages:[],

conversationId:null

};

}







const {
data,
error
}=await supabase

.from("messages")

.select(`

id,

message,

sender_id,

receiver_id,

created_at

`)

.eq(
"conversation_id",
conversation.id
)

.order(
"created_at",
{
ascending:true
}
);






if(error){

console.error(
"Messages error:",
error
);


return {

messages:[],

conversationId:conversation.id

};

}





return {

messages:data || [],

conversationId:conversation.id

};


}







export const metadata={


title:
"Messages | Halo Marketplace",


description:
"Chat securely with buyers and sellers on Halo Marketplace."


};







export default async function MessagesPage({
searchParams
}){


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





const params =
await searchParams;



const sellerId =
params?.seller || "";





const conversations =
await getConversations(
user.id
);



let initialMessages=[];

let conversationId=null;

let sellerProfile=null;
// ===============================
// LOAD ACTIVE CONVERSATION
// ===============================


if(sellerId){


const result =
await getMessagesForConversation(
user.id,
sellerId
);



initialMessages =
result.messages;


conversationId =
result.conversationId;






// Create conversation if it does not exist

if(!conversationId){


conversationId =
await getOrCreateConversation(
sellerId
);


}






const {
data:profile
}=await supabase

.from("profiles")

.select(`

username,

avatar,

verified

`)

.eq(
"id",
sellerId
)

.single();





sellerProfile =
profile ||
{

username:"Halo User",

avatar:"/avatar.png",

verified:false

};



}








return (

<main className="
min-h-screen
bg-gray-50
px-4
py-8
md:px-6
">





<div className="
mx-auto
max-w-7xl
overflow-hidden
rounded-3xl
bg-white
shadow
">





<div className="
flex
h-[80vh]
flex-col
md:flex-row
">






{/* ===============================
CONVERSATION SIDEBAR
=============================== */}





<aside className="
w-full
border-b
bg-gray-50
md:w-96
md:border-b-0
md:border-r
overflow-y-auto
">





<div className="
border-b
p-5
">

<h2 className="
text-2xl
font-black
">

Messages

</h2>


<p className="
mt-1
text-sm
text-gray-500
">

Buyer and seller conversations

</p>


</div>







{

conversations.length === 0 ? (



<div className="
p-8
text-center
text-gray-500
">


<p>

No conversations yet.

</p>




<Link

href="/browse"

className="
mt-4
block
font-bold
text-indigo-600
"

>

Browse Listings

</Link>


</div>




):(






<ul className="
divide-y
">


{conversations.map(conv=>(



<li

key={conv.id}

>


<Link

href={`/messages?seller=${conv.otherUserId}`}

className={`

block

p-5

transition

hover:bg-gray-100


${

sellerId === conv.otherUserId

?

"bg-indigo-50"

:

""

}

`}

>




<div className="
flex
items-center
gap-4
">





<Image

src={conv.avatar}

alt={conv.username}

width={48}

height={48}

className="
rounded-full
"

/>








<div className="
min-w-0
flex-1
">



<div className="
flex
items-center
gap-2
">


<p className="
truncate
font-black
">

{conv.username}

</p>




{conv.verified && (

<span className="
text-xs
font-bold
text-green-600
">

✓

</span>

)}


</div>







<p className="
truncate
text-sm
text-gray-500
">

{conv.lastMessage}

</p>




</div>





</div>




</Link>


</li>


))}


</ul>






)

}





</aside>





{/* ===============================
CHAT WINDOW
=============================== */}



<div className="
flex-1
flex
flex-col
">





{sellerId ? (




<>


{/* CHAT HEADER */}


<div className="
flex
items-center
gap-4
border-b
p-5
">


<Image

src={
sellerProfile?.avatar ||
"/avatar.png"
}

alt={
sellerProfile?.username ||
"User"
}

width={48}

height={48}

className="
rounded-full
"

/>





<div>


<h2 className="
text-xl
font-black
">

{
sellerProfile?.username ||
"Halo User"
}

</h2>






{sellerProfile?.verified && (

<p className="
text-sm
font-bold
text-green-600
">

✓ Verified Seller

</p>

)}



</div>



</div>







{/* CHAT COMPONENT */}



<div className="
flex-1
overflow-hidden
">


<Chat

user={user}

receiverId={sellerId}

initialMessages={initialMessages}

conversationId={conversationId}

sellerProfile={sellerProfile}

/>


</div>



</>





):(





<div className="
flex
flex-1
items-center
justify-center
p-10
text-center
">


<div>


<div className="
text-6xl
">

💬

</div>



<h2 className="
mt-5
text-2xl
font-black
">

Select a conversation

</h2>




<p className="
mt-3
text-gray-500
">

Start chatting with sellers from any Halo listing.

</p>





<Link

href="/browse"

className="
mt-6
inline-block
rounded-xl
bg-black
px-8
py-3
font-bold
text-white
"

>

Browse Marketplace

</Link>



</div>


</div>





)}



</div>





</div>



</div>


</main>


);


}