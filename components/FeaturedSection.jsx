import ProductCard from "./ProductCard";


export default function FeaturedSection(){


const products=[

{
title:"Apple MacBook Pro",
price:"$1899",
location:"Edmonton, AB",
image:"💻"
},

{
title:"Mountain Bike",
price:"$750",
location:"Calgary, AB",
image:"🚲"
},

{
title:"Gaming PC Setup",
price:"$2200",
location:"Toronto, ON",
image:"🎮"
}

];


return (

<section className="max-w-7xl mx-auto px-6 py-20">


<h2 className="text-4xl font-bold">
Featured Products
</h2>


<div className="mt-10 grid md:grid-cols-3 gap-8">


{
products.map(product=>(

<ProductCard
key={product.title}
{...product}
/>

))
}


</div>


</section>

)

}
