export default function ProductCard({
title,
price,
location,
image
}){

return(

<div className="bg-white rounded-2xl shadow p-6 hover:shadow-xl transition">


<div className="text-6xl">
{image}
</div>


<h3 className="mt-5 text-xl font-bold">
{title}
</h3>


<p className="text-indigo-600 font-bold mt-2">
{price}
</p>


<p className="text-gray-500 mt-2">
📍 {location}
</p>


<button className="mt-5 w-full bg-indigo-600 text-white py-3 rounded-xl">
View Product
</button>


</div>

);

}
