import User from "../models/user.js"
import bcrypt from "bcrypt"


// registering a new user
export const register =  async (req,res) => {

    const {username,password,firstname,lastname} = req.body;

    const salt = await bcrypt.genSaltSync(10);
    const hash =  await bcrypt.hashSync(password,salt);

    const newUser = new User({username,password:hash,firstname,lastname});
    try {
        await newUser.save();
        res.status(200).json(newUser);
    } catch (error) {
        res.status(500).json({message:error.message})
    } 
}

// login a user
export const login =  async (req,res) => {

    const {username,password} = req.body;

    try {
        
        const user = await User.findOne({username:username});
        if(user)
        {
            const validity = await bcrypt.compare(password,user.password)
            validity ? res.status(200).json(user):res.status(400).send("wrong user")
        }
        
    } catch (error) {
        res.status(500).json({message:error.message})
    } 
}