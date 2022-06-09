import express  from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import dotenv from "dotenv"
import auth from "./routes/auth.js"
import user from "./routes/user.js"
import posts from "./routes/posts.js"

dotenv.config()
const app = express();
app.use(bodyParser.json({limit:"30mb",extended:"true"}))
app.use(bodyParser.urlencoded({limit:"30mb",extended:"true"}))


// routes
app.use('/auth',auth);
app.use("/user",user);
app.use('/post',posts)
mongoose.connect(process.env.Mongodb,{
    useNewUrlParser:true,
    useUnifiedTopology:true
}).then( ()=> {
    app.listen(process.env.Port,() =>{
        console.log("app is listening")
    })
}).catch((error)=>{
    console.log(error)
})