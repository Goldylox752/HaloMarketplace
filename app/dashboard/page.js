export default function DashboardPage(){

return(

<main className="min-h-screen bg-gray-50 p-10">


<h1 className="text-5xl font-bold">
Seller Dashboard
</h1>


<div className="grid md:grid-cols-3 gap-6 mt-10">


<div className="bg-white p-8 rounded-2xl shadow">
<h2 className="text-3xl font-bold">
24
</h2>
<p>
Listings
</p>
</div>


<div className="bg-white p-8 rounded-2xl shadow">
<h2 className="text-3xl font-bold">
$8,420
</h2>
<p>
Sales
</p>
</div>


<div className="bg-white p-8 rounded-2xl shadow">
<h2 className="text-3xl font-bold">
156
</h2>
<p>
Messages
</p>
</div>


</div>


</main>

);

}
