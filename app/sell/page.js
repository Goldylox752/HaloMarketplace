export default function SellPage(){

return(

<main className="min-h-screen bg-gray-50 py-16 px-6">


<div className="max-w-3xl mx-auto bg-white p-10 rounded-2xl shadow">


<h1 className="text-4xl font-bold">
Sell Your Product
</h1>


<p className="mt-3 text-gray-600">
Create a listing and reach buyers across Canada.
</p>


<input
className="mt-8 w-full border p-3 rounded-xl"
placeholder="Product title"
/>


<textarea
className="mt-4 w-full border p-3 rounded-xl"
placeholder="Description"
/>


<input
className="mt-4 w-full border p-3 rounded-xl"
placeholder="Price"
/>


<button className="mt-6 bg-indigo-600 text-white px-8 py-3 rounded-xl">
Create Listing
</button>


</div>


</main>

);

}
