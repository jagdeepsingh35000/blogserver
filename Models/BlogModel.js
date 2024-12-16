const mongoose = require("mongoose")

let blogSchema = mongoose.Schema({
  image:
    {
       imageUrl:{
        type:String,
        required:true
       },
       image_publicId:{
        type:String,
        required:true
       }
    },
    title:{
        type:String,
        required:true
    },
    content:
    {
        type:String,
         required:true,
    },
    userid:
    {
        type:String,
        required:true,

    },  
   
    


},
{
  timestamps:true
})
 
let BlogSchema = mongoose.model("blog",blogSchema)

module.exports = BlogSchema;