export default function ImageGallery(){

const images=[
"📱",
"💻",
"🖥️"
];


return (

<div className="space-y-4">


<div className="
h-96
bg-white
rounded-3xl
shadow
flex
items-center
justify-center
text-9xl
">

💻

</div>



<div className="flex gap-4">

{
images.map((image)=>(
<div
key={image}
className="
bg-white
shadow
rounded-xl
p-5
text-3xl
"
>

{image}

</div>
))
}

</div>


</div>

)

}
