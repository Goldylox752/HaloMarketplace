"use client";


import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";



export default function Chat({

user,

initialMessages

}){


const [messages,setMessages]=useState(
initialMessages
);


const [text,setText]=useState("");



const supabase=createClient();




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


setMessages(prev=>[

...prev,

payload.new

]);


}

)

.subscribe();



return ()=>{

supabase.removeChannel(channel);

};


},[]);






async function sendMessage(){


if(!text)return;



await supabase

.from("messages")

.insert({

sender_id:user.id,

receiver_id:user.id,

message:text

});



setText("");

}





return (

<div className="mt-8">


<div className="h-96 overflow-y-auto border rounded-xl p-5 space-y-3">


{
messages.map((msg)=>(


<div

key={msg.id}

className={

msg.sender_id===user.id

?

"bg-indigo-600 text-white p-3 rounded-xl ml-auto max-w-xs"

:

"bg-gray-100 p-3 rounded-xl max-w-xs"

}

>


{msg.message}


</div>


))

}


</div>






<div className="flex gap-3 mt-5">


<input

value={text}

onChange={
e=>setText(e.target.value)
}

placeholder="Write a message..."

className="flex-1 border rounded-xl p-4"

/>



<button

onClick={sendMessage}

className="bg-indigo-600 text-white px-6 rounded-xl font-bold"

>

Send

</button>



</div>


</div>

)

}
