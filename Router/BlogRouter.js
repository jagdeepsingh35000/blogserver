const express = require("express");
const multer = require("multer");
const path = require('path');
const { createBlog, AllBlog, DeleteBlog, UpdateBlog, AllBlogOneUser } = require("../Controllers/BlogController");
const { BlogAuthMiddleWare } = require("../MiddleWare/AuthMiddleWare");
const checkLoginMiddle = require("../MiddleWare/CheckLoginMiddleWare");
const BlogRouter = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      // Specify the directory to store the uploaded files
      cb(null, 'public/');
    },
    filename: (req, file, cb) => {
      // Specify the file name (we'll use the original name and add a timestamp to avoid overwriting)
      cb(null, Date.now() + path.extname(file.originalname));
    }
  });

  const upload = multer({ storage: storage });

  BlogRouter.post("/create-blog",upload.single('image'),checkLoginMiddle,createBlog)
  BlogRouter.get("/all",AllBlog)
  BlogRouter.delete("/delete",DeleteBlog)
  BlogRouter.put("/update",upload.single('image'),UpdateBlog)
  BlogRouter.post("/userblog",checkLoginMiddle,AllBlogOneUser)
  module.exports = BlogRouter;