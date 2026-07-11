import ProductCard from "./ProductCard";


const products=[

{
title:"iPhone 15 Pro",
price:999,
location:"Edmonton AB",
image:"https://images.unsplash.com/photo-1592899677977-9c10ca588bbd"
},


{
title:"Gaming PC RTX 4070",
price:1400,
location:"Calgary AB",
image:"https://images.unsplash.com/photo-1593640408182-31c2289a4932"
},


{
title:"Modern Sofa",
price:600,
location:"Toronto ON",
image:"https://images.unsplash.com/photo-1555041469-a586c61ea9bc"
}

];


export default function FeaturedProducts(){

return(

<section className="py-16 bg-gray-50">


<div className="max-w-7xl mx-auto px-6">


<h2 className="text-3xl font-bold mb-10">

Trending Products

</h2>


<div className="grid md:grid-cols-3 gap-8">


{products.map((product)=>(

<ProductCard

key={product.title}

product={product}

/>

))}


</div>


</div>


</section>

)

}
