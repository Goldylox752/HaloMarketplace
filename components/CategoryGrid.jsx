const categories=[
"Electronics",
"Vehicles",
"Home",
"Fashion",
"Tools",
"Sports",
"Collectibles",
"Services"
];


export default function CategoryGrid(){

return(

<section className="py-20">

<div className="max-w-7xl mx-auto px-6">


<h2 className="text-4xl font-bold mb-10">
Shop Categories
</h2>


<div className="grid grid-cols-2 md:grid-cols-4 gap-6">


{categories.map((cat)=>(

<div
key={cat}
className="p-8 rounded-2xl border hover:shadow-lg cursor-pointer"
>

<h3 className="text-xl font-bold">
{cat}
</h3>

</div>

))}


</div>

</div>

</section>

)

}
