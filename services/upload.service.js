const supabase = require("../config/supabase");



async function uploadProductImage(file){


const fileName =

`products/${Date.now()}-${file.originalname}`;



const {error} = await supabase.storage

.from("product-images")

.upload(

fileName,

file.buffer,

{

contentType:file.mimetype

}

);



if(error){

throw error;

}



const {

data

} = supabase.storage

.from("product-images")

.getPublicUrl(fileName);



return data.publicUrl;


}



module.exports = {

uploadProductImage

};