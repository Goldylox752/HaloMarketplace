import { NextResponse } from "next/server";


export async function POST(request){


try {


const body = await request.json();



const {
product,
condition,
details,
image

} = body;





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







const prompt = `

You are Halo Marketplace AI.

Create a professional marketplace listing.

Product:
${product}

Condition:
${condition}

Details:
${details}


Return ONLY valid JSON:

{
"title":"",
"description":"",
"category":"",
"suggested_price":"",
"keywords":[]
}

`;







// AI connection placeholder
// Replace with your AI provider


const response = await fetch(
"https://api.openai.com/v1/chat/completions",
{

method:"POST",

headers:{

"Content-Type":"application/json",

"Authorization":
`Bearer ${process.env.OPENAI_API_KEY}`

},


body:JSON.stringify({

model:"gpt-4.1-mini",

messages:[

{

role:"system",

content:
"You create marketplace listings."

},

{

role:"user",

content:prompt

}

],


temperature:0.7


})


}

);








const data =
await response.json();







if(!data.choices){


return NextResponse.json(

{
error:"AI generation failed"
},

{
status:500
}

);


}






let listing;


try{


listing =
JSON.parse(
data.choices[0]
.message
.content
);


}

catch{


listing={

title:product,

description:details,

category:"General",

suggested_price:"",

keywords:[]

};


}







return NextResponse.json({

success:true,

listing,

image:image || null

});







}catch(error){


console.error(
"AI Listing Error:",
error
);



return NextResponse.json(

{
error:"Server error"
},

{
status:500
}

);


}


}