"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";



export default function Chat({

user,

receiverId,

initialMessages = []

}){


const supabase = createClient();


const [messages,setMessages] = useState(
initialMessages
);


const [text,setText] = useState("");

const [loading,setLoading] = useState(false);





useEffect(()=>{


const channel = supabase

.channel("messages")

.on(

"postgres_changes",

{

event:"INSERT",

schema:"public",

table:"messages"

},

(payload)=>{


const newMessage = payload.new;



if(

(newMessage.sender_id === user.id &&
newMessage.receiver_id === receiverId)

||

(newMessage.sender_id === receiverId &&
newMessage.receiver_id === user.id)

){


setMessages(prev=>[

...prev,

newMessage

]);


}



}

)

.subscribe();





return ()=>{

supabase.removeChannel(channel);

};



},[user.id,receiverId]);









async function sendMessage(){


if(!text.trim()) return;



setLoading(true);




const {

data,

error

}= await supabase

.from("messages")

.insert({

sender_id:user.id,

receiver_id:receiverId,

message:text.trim()

})

.select()

.single();





if(!error && data){


setMessages(prev=>[

...prev,

data

]);


}



setText("");

setLoading(false);


}







return (

<div className="mt-8">



<div className="
h-96
overflow-y-auto
rounded-xl
border
p-5
space-y-3
">


{

messages.map((msg)=>(


<div

key={msg.id}

className={

msg.sender_id === user.id

?

"ml-auto max-w-xs rounded-xl bg-indigo-600 p-3 text-white"

:

"max-w-xs rounded-xl bg-gray-100 p-3"

}

>

{msg.message}


</div>


))

}



</div>







<div className="
mt-5
flex
gap-3
">


<input

value={text}

onChange={
e=>setText(e.target.value)
}

placeholder="Write a message..."

className="
flex-1
rounded-xl
border
p-4
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