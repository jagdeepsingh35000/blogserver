const express = require("express");
const { CreateUser, LoginUser, VerifyUser, Otpgenerate,VerfifyOtp,UpdatePassword} = require("../Controllers/UserController");

const multer = require("multer");
const path = require('path');
const { AuthMiddleWare } = require("../MiddleWare/AuthMiddleWare");

const UserRouter = express.Router();



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

UserRouter.post("/register",upload.single('image'),AuthMiddleWare,CreateUser);
UserRouter.post("/login",LoginUser)
UserRouter.get("/verify",VerifyUser)
UserRouter.post("/otpgenerate",Otpgenerate)
UserRouter.post("/verifyotp",VerfifyOtp)
UserRouter.post("/changepassword",UpdatePassword)

module.exports = UserRouter;