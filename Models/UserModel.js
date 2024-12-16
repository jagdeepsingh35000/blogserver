const mongoose = require("mongoose")

let userSchema = mongoose.Schema({
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
    name:{
        type:String,
        minLength:3,
        maxLength:12,
        required:true
    },
    email:
    {
        type:String,
         required:true,
         unique:true
    },
    password:{
        type:String,
        required:true
    },


})
 
let UserSchema = mongoose.model("user",userSchema)

module.exports = UserSchema;