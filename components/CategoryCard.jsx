export default function CategoryCard({
title,
icon
}){


return(

<div className="bg-white p-8 rounded-2xl shadow hover:shadow-lg transition text-center">


<div className="text-5xl">
{icon}
</div>


<h3 className="mt-4 text-xl font-bold">
{title}
</h3>


</div>

);

}
