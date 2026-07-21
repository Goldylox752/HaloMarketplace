import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";



function createSlug(text){

return text
.toLowerCase()
.replace(/[^a-z0-9]+/g,"-")
.replace(/(^-|-$)/g,"");

}





export async function POST(request){


try{


const supabase =
await createClient();



// USER CHECK


const {
data:{
user
}

}=await supabase.auth.getUser();



if(!user){

return NextResponse.json(

{
error:"Login required"
},

{
status:401
}

);

}






const formData =
await request.formData();



const product =
formData.get("product")?.toString();


const condition =
formData.get("condition")?.toString();


const details =
formData.get("details")?.toString();


const image =
formData.get("image")?.toString();






if(!product){


return NextResponse.json(

{
error:"Product name required"
},

{
status:400
}

);

}








// AI PROMPT


const prompt = `

Create a marketplace listing.

Product:
${product}

Condition:
${condition}

Extra details:
${details}


Return ONLY valid JSON.

Format:

{
"title":"",
"description":"",
"category":"",
"price":0,
"tags":[]
}

`;






const ai = await fetch(

"https://api.groq.com/openai/v1/chat/completions",

{

method:"POST",

headers:{

Authorization:
`Bearer ${process.env.GROQ_API_KEY}`,

"Content-Type":
"application/json"

},


body:JSON.stringify({

model:
"llama-3.1-70b-versatile",

messages:[

{
role:"system",
content:
"You are Halo AI, an expert marketplace copywriter."
},

{
role:"user",
content:prompt
}

],

temperature:0.5

})

}

);






const result =
await ai.json();





let content =
result?.choices?.[0]?.message?.content;





if(!content){


throw new Error(
"AI returned empty response"
);

}






// Remove markdown JSON wrappers


content =
content
.replace(/```json/g,"")
.replace(/```/g,"")
.trim();





let listing;



try{


listing =
JSON.parse(content);



}catch{


listing={

title:product,

description:details || "",

category:"Other",

price:0,

tags:[]

};


}







// CREATE PRODUCT DRAFT


const slug =
createSlug(
listing.title
);





const {
data:newProduct,
error
}=await supabase

.from("products")

.insert({

title:
listing.title,

description:
listing.description,


category:
listing.category,


price:
Number(listing.price) || 0,


image:
image || null,


slug,


tags:
listing.tags,


ai_generated:true,


status:
"draft",


seller_id:
user.id


})

.select()

.single();







if(error){


console.error(
"Product save error:",
error
);



return NextResponse.json(

{
error:error.message
},

{
status:500
}

);

}







return NextResponse.json({

success:true,

product:newProduct,

message:
"AI listing created successfully"

});






}catch(error){


console.error(
"AI Listing Error:",
error
);



return NextResponse.json(

{
error:"AI listing generation failed"
},

{
status:500
}

);


}


}