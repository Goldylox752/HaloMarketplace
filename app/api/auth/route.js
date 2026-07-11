import { supabase } from "@/lib/supabase";


export async function POST(request){


const {
email,
password
}= await request.json();



const {
data,
error
}= await supabase.auth.signUp({

email,

password

});



if(error){

return Response.json(
{
error:error.message
},
{
status:400
}
);

}


return Response.json(data);


}
