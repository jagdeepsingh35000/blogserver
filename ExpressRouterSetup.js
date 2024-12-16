const express = require("express")
const mongoose  = require("mongoose")
const UserRouter = require("./Router/UserRouter")
const server = express()
const cors = require("cors")
const BlogRouter = require("./Router/BlogRouter")
require("dotenv").config()

server.use(express.json())
server.use(cors())

server.get("/",(req,res)=>
    {
        console.log("this is the get req")
        res.send("ffanflaflaf")
    })

server.use("/user",UserRouter)
server.use("/blog",BlogRouter)

mongoose.connect(process.env.MONGO_URL)
 .then(()=>{
    
    console.log("db connected")
    server.listen(7000,(req,res)=>
        {
            console.log("server is up on 7000")
        })
})
 .catch((err)=>console.log(err))



 function errMiddleWare(err,req,res,next)
 { 
    
    res.status(err.statusCode).json(
        {
            errmsg:err.message,
            stack:err.stack

        }
    )
 }

   
server.use(errMiddleWare)

