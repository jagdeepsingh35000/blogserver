const { validationResult } = require("express-validator");
const errResponse = require("../Helpers/errResponse");
const UserSchema = require("../Models/UserModel");
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken");
const cloudinary = require("../ConfigOfCloud/CloudConfig")
const nodemailer = require('nodemailer');
const crypto = require('crypto');

const file = require("fs")
const path = require("path")
let otpStore = {};


let CreateUser =async (req,res,next)=>
{
  try{

    let result = validationResult(req);
    let err = result.errors;
  
    let error = err.map((e)=> e.msg)
    if(error.length)
    {
      return  next(new errResponse(error[0],400) ) 
  
  
    }
    
     let data =  req.body;
     let existingUser = await UserSchema.findOne({ email: data.email });
     if (existingUser) {
       file.unlinkSync(path.resolve(req.file.path))
       return  next(new errResponse("email is already in use",400)) 
     }
      await cloudinary.api.create_folder("Jagdeep")
    //  console.log(response)
     let cloudImg = await cloudinary.uploader.upload(req.file.path,{folder:"Jagdeep"})
     console.log(cloudImg)
    file.unlinkSync(path.resolve(req.file.path))
  
     let haspassword = bcrypt.hashSync(data.password, 10);
     let newUser = await UserSchema.create({ ...data, password: haspassword,"image":{imageUrl:cloudImg.url,image_publicId:cloudImg.public_id} });
  
     res.send(newUser);
  
  
  }
  catch(err)
  {
    next(new errResponse(err.message,500))
  }
}

let LoginUser = async (req, res,next) => {

  let data = req.body;
  let existingUser = await UserSchema.findOne({ email: data.email });
  if (!existingUser) {
    return  next(new errResponse("user not found",401));
  }

  let result =  bcrypt.compareSync(data.password,existingUser.password)// camparing password using bcrypt
 if(!result)
 {
  return next(new errResponse("wrong pass",400) ) 
 }

 let token =jwt.sign({userid:existingUser._id},"thisisprivatekey",{expiresIn:"1d"})
 res.send({existingUser,token});

}

let VerifyUser = async(req,res,next)=>
  {
    try
    {
      let header = req.headers.authorization;
      
      
      if(!header)
      {
         return next(new errResponse("no header provided",400) ) 
      }
      let token = header.split(" ")[1];
      
      if(!token)
      {
         return  next(new errResponse("no token provided",400) )
         
      }
      
      let payload = jwt.verify(token,"thisisprivatekey")
      
      let existinguser = await UserSchema.findById(payload.userid);

      if(!existinguser)
      {
          return next(new errResponse("you are  not a vaild user",400))
      } 
        res.status(200).json({
          success:true,
          data:existinguser
          
      
        })
      
    }
    catch(err0r)
    {
      next(new errResponse("you are  not a vaild user",500))
      console.log("token expired")
    }
    }
  
let Otpgenerate = (req,res)=>
{
  let {email} = req.body;

  const transporter = nodemailer.createTransport({
    service: 'gmail', // You can use any email service (e.g., SendGrid)
    auth: {
      user: 'jagdeepsingh35000@gmail.com',
      pass: 'bucu jhfs zwcj cvhs',
    },
  });

  
  const otp = crypto.randomInt(100000, 999999).toString();
  console.log(otp)
  const expiry = Date.now() + 300000;

  otpStore[email] = { otp, expiry };
  const mailOptions = {
    from: 'jagdeepsingh35000@gmail.com',
    to: email,
    subject: 'Your OTP Code',
    text: `Your OTP code is: ${otp}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Error sending email:', error);
      return res.status(500).json({ success: false, message: 'Failed to send OTP.' });
    }
    console.log('Email sent:', info.response);
    return res.status(200).json({ success: true, message: 'OTP sent successfully!' });


})

}


let VerfifyOtp = async (req, res)=>
  {
 
   const { email, otp } = req.body;
 
    // Check if the OTP exists and is valid
    if (!otpStore[email]) {
     return res.status(400).json({ success: false, message: 'OTP not found.' });
   }
 
   const { otp: storedOtp, expiry } = otpStore[email];
 
   if (Date.now() > expiry) {
     delete otpStore[email];  // Remove expired OTP
     return res.status(400).json({ success: false, message: 'OTP expired.' });
   }
 
   if (storedOtp === otp) {
    //  delete otpStore[email];  // Remove OTP after successful verification
     return res.status(200).json({ success: true, message: 'OTP verified successfully!' });
   } else {
     return res.status(400).json({ success: false, message: 'Invalid OTP.' });
   }
 
  }
 
  let UpdatePassword = async(req,res,next)=>
  {
   
     try
     {
      let {email,password}= req.body;
      let haspassword = bcrypt.hashSync(password, 10);
      let update = await UserSchema.updateOne({email},   // Filter: Find the document with this email
        { $set:{ password: haspassword } })

        if (update.matchedCount === 0) {
          console.log("im")
          return  next(new errResponse("email is not register with us",400) ) 
        }
       
        res.status(200).json({ message: "Password updated successfully.", update });
       
     }
     catch(err)
     {
      console.log(err)
     }

  }
 

module.exports = {CreateUser,LoginUser,VerifyUser,Otpgenerate,VerfifyOtp,UpdatePassword}