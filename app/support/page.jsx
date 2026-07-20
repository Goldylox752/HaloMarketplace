import Link from "next/link";


export const metadata = {

title:
"Support Halo Market | Keep Marketplace Free",

description:
"Support Halo Market and help us keep buying and selling free across Canada.",

};



export default function SupportPage(){


return (

<main className="min-h-screen bg-white text-slate-900">


<section className="bg-black px-6 py-24 text-center text-white">


<h1 className="text-5xl font-black">

Support Halo Market

</h1>


<p className="mx-auto mt-6 max-w-3xl text-xl text-gray-300">

Help us keep Halo Market free for buyers and sellers
across Canada.

</p>


</section>





<section className="mx-auto max-w-5xl px-6 py-20 text-center">


<h2 className="text-4xl font-black">

Why Support Us?

</h2>


<p className="mt-6 text-lg text-gray-600">

Halo Market is built to give people a simple,
secure, and affordable way to buy and sell.
Your support helps cover hosting, development,
security, and future improvements.

</p>





<div className="mt-12 grid gap-6 md:grid-cols-3">


<div className="rounded-3xl border p-8">

<h3 className="text-xl font-bold">

☁️ Hosting

</h3>

<p className="mt-3 text-gray-600">

Help keep Halo Market online and reliable.

</p>

</div>




<div className="rounded-3xl border p-8">

<h3 className="text-xl font-bold">

🚀 Development

</h3>

<p className="mt-3 text-gray-600">

Support new features and improvements.

</p>

</div>




<div className="rounded-3xl border p-8">

<h3 className="text-xl font-bold">

🔒 Security

</h3>

<p className="mt-3 text-gray-600">

Help maintain a safe marketplace.

</p>

</div>


</div>





<div className="mt-16 rounded-3xl bg-indigo-600 p-10 text-white">


<h2 className="text-3xl font-black">

Become a Supporter

</h2>


<p className="mt-4">

Every contribution helps us keep Halo Market free.

</p>




<a

href="YOUR_STRIPE_PAYMENT_LINK"

className="mt-8 inline-block rounded-xl bg-white px-8 py-4 font-bold text-indigo-600"

>

Donate Now

</a>


</div>






<p className="mt-12 text-sm text-gray-500">

Thank you for helping build a better marketplace.

</p>


</section>


</main>

);

}