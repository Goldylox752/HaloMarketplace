import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";


export default async function StorePage({ params }) {


const { id } = await params;


console.log("STORE ID:", id);



const supabase = await createClient();



const { data, error } = await supabase
.from("profiles")
.select("*")
.eq("id", id)
.single();



console.log("PROFILE:", data);
console.log("ERROR:", error);



if(error || !data){

notFound();

}



return (

<main className="p-10">

<h1 className="text-4xl font-bold">

{data.username}

</h1>


<p>

Seller ID:

{id}

</p>


</main>

);


}