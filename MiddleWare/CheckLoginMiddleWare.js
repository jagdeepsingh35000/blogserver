const jwt = require("jsonwebtoken");
const User = require("../Models/UserModel");
const errResponse = require("../Helpers/errResponse");

 async function checkLoginMiddle (req,res,next)
{
try{
    let header = req.headers.authorization;
    let body = req.body
    
    
if(!header)
{
   return next(new errResponse("no header provided",400) ) 
//    next(new Error("no header provided"))
}
let token = header.split(" ")[1];

if(!token)
{
   return  next(new errResponse("no token provided",400) )
   
}

let payload = jwt.verify(token,"thisisprivatekey")
let existinguser = await User.findById(payload.userid);

if(!existinguser)
{
    return next(new errResponse("you are  not a vaild user",400))
}   
req.user =  existinguser;

console.log(existinguser)
next();
}
catch(err)
{
    next(new errResponse(err.message,400))
}

}

module.exports = checkLoginMiddle;