"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";



export default function Chat({

  user,

  receiverId,

  conversationId,

  initialMessages = [],

}){


const supabase = createClient();



const [messages,setMessages] = useState(
  initialMessages
);


const [text,setText] = useState("");

const [loading,setLoading] = useState(false);

const [error,setError] = useState("");





// REALTIME LISTENER

useEffect(()=>{


if(!conversationId) return;



const channel = supabase

.channel(`conversation-${conversationId}`)

.on(

"postgres_changes",

{

event:"INSERT",

schema:"public",

table:"messages",

filter:
`conversation_id=eq.${conversationId}`

},

(payload)=>{


const incoming = payload.new;



setMessages((prev)=>{


const exists = prev.some(
(msg)=>msg.id === incoming.id
);


if(exists){

return prev;

}


return [

...prev,

incoming

];


});


}

)

.subscribe();





return ()=>{

supabase.removeChannel(channel);

};



},[conversationId]);









async function sendMessage(){


if(!text.trim()) return;


if(!conversationId){

setError(
"No conversation found"
);

return;

}



setLoading(true);

setError("");




const messageText = text.trim();




const {

data,

error

}= await supabase

.from("messages")

.insert({

conversation_id:conversationId,

sender_id:user.id,

receiver_id:receiverId,

message:messageText

})

.select()

.single();






if(error){


console.error(error);

setError(
"Failed to send message"
);

setLoading(false);

return;

}





// Optimistic update

setMessages(prev=>[

...prev,

data

]);



setText("");

setLoading(false);



}







function handleKeyDown(e){


if(e.key==="Enter"){

sendMessage();

}


}








return (

<div className="
flex
h-full
flex-col
p-5
">





<div className="
flex-1
overflow-y-auto
space-y-3
rounded-xl
border
p-5
bg-white
">


{


messages.map((msg)=>(


<div

key={msg.id}

className={

msg.sender_id === user.id

?

"ml-auto max-w-xs rounded-2xl bg-indigo-600 p-4 text-white"

:

"max-w-xs rounded-2xl bg-gray-100 p-4 text-gray-900"

}

>


{msg.message}



</div>


))


}



</div>








{error && (

<p className="
mt-3
text-sm
font-bold
text-red-500
">

{error}

</p>

)}







<div className="
mt-4
flex
gap-3
">


<input

value={text}

onChange={(e)=>
setText(e.target.value)
}

onKeyDown={handleKeyDown}

placeholder="Write a message..."

className="
flex-1
rounded-xl
border
px-4
py-3
outline-none
focus:ring-2
focus:ring-indigo-500
"

/>





<button

onClick={sendMessage}

disabled={loading}

className="
rounded-xl
bg-indigo-600
px-6
font-bold
text-white
disabled:opacity-50
"

>


{

loading

?

"Sending..."

:

"Send"

}


</button>



</div>





</div>

);


}