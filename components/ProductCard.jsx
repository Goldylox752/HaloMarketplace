import Link from "next/link";


export default function ProductCard({

id,
title,
price,
location,
image

}){


return (

<div className="bg-white rounded-2xl shadow hover:shadow-xl transition p-6">


<div className="text-6xl">
{image}
</div>


<h3 className="mt-5 text-xl font-bold">
{title}
</h3>


<p className="mt-2 text-indigo-600 font-bold text-lg">
{price}
</p>


<p className="mt-2 text-gray-500">
📍 {location}
</p>



<Link

href={`/product/${id}`}

className="block mt-5 text-center bg-indigo-600 text-white py-3 rounded-xl"

>

View Product

</Link>


</div>

)

}
