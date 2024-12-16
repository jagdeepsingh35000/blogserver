const BlogSchema = require("../Models/BlogModel");
const cloudinary = require("../ConfigOfCloud/CloudConfig");
const { response } = require("express");
const file = require("fs")
const path = require("path")


let createBlog = async (req,res)=>
{
    try
    {
        let data =  req.body;
        let id = req.user._id;
   console.log(id)
   console.log("i m here in crate")
       await cloudinary.api.create_folder("BlogImages")
    
         let result = await cloudinary.uploader.upload(req.file.path,{folder:"BlogImages"})
        
        file.unlinkSync(path.resolve(req.file.path))
    
        let newBlog = await BlogSchema.create({...data,"userid":id,"image":{imageUrl:result.url,image_publicId:result.public_id}})
        res.send(newBlog)
        console.log(newBlog)
    }
    catch(error)
    {
        console.log(error)
        return next(new errResponse(error,400) ) 
    }
}

let AllBlog = async (req,res)=>
{
let allblogs = await BlogSchema.find();
res.send(allblogs)
}

let DeleteBlog = async (req, res) => {
    console.log("im here")
    let id = req.headers.id;
    console.log(id)
    cloudinary.uploader.destroy(req.headers.imageid) //delte the phto from the cluodinary using image public id.
    let deleteProduct = await BlogSchema.findByIdAndDelete(id) //delte the product from database using user id
  
    if (!deleteProduct) {
      return res.send("no blog find ");
    }
    res.send("blog delete ");
    
  };



  let UpdateBlog = async (req, res) => {
    console.log("i am here update1")
    let id = req.headers.id;
    console.log(id)
    let data = req.body;
    console.log(data)
    let result = null;
     let udpate = null;
    console.log(data)
  
  
  
  if(data.flag == "true")
  {
    console.log("i am here update")
     result = await cloudinary.uploader.upload(req.file.path)
    cloudinary.uploader.destroy(data.publicId)
    file.unlinkSync(path.resolve(req.file.path))
    // console.log(result)
  delete data.flag;
  delete data.publicId;
  console.log(data)
    
    udpate =await BlogSchema.findByIdAndUpdate(id,{...data,"image":{imageUrl:result.url,image_publicId:result.public_id}});
  
  console.log(data.publicId)
  }
  else{
  
   udpate =await BlogSchema.findByIdAndUpdate(id,data);
  }
  
  res.send(udpate);
  console.log(udpate)
   };

   let AllBlogOneUser= async (req,res)=>
   {
    try {
      console.log("in userblog")
      console.log(req.user._id)
      let userId = req.user._id; // Assuming req.user contains the authenticated user's details
  
      // Find blogs where the userId matches the current user's ID
      let allBlogs = await BlogSchema.find({ userid: userId });
      res.status(200).send(allBlogs);
    } catch (error) {
      console.error("Error fetching blogs:", error);
      return next(new errResponse(error,500) ) 

    }
   }
  

module.exports = {createBlog,AllBlog,DeleteBlog,UpdateBlog,AllBlogOneUser}