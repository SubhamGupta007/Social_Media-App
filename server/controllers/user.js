import User from "../models/user.js";

// get a user
export const getuser = async(req,res) => {
    const id=req.params.id;
    const user = await User.findById(id);

    if(!user)
    {
        res.status(400).send("user does not exists");
    }
    else
    {
        const {password,...otherdetails} = user._doc;
        res.status(200).json(otherdetails);
    }
}

// update user

export const updateuser = async(req,res) => {
    const id=req.params.id;
    const {currentUserid,currentUserAdminstatus,password} = req.body

    if(id==currentUserid || currentUserAdminstatus)
    {
        try {

            if(password)
            {
                const salt = await bcrypt.getsalt(10);
                req.body.password = await bcrypt.hash(password,salt);
            }
            const user = await User.findByIdAndUpdate(id,req.body,{new:true});
            res.status(200).json(user);
        } catch (error) {
            res.status(500).json(error);
        }
    }
}

// delete user
export const deleteuser  = async (req,res) => {
    const id = req.params.id;

    const {currentUserid , currentUserAdminstatus } =req.body;

    if(currentUserid === id  || currentUserAdminstatus)
    {
       try {
           await User.findByIdAndDelete(id);
           res.status(200).json("user deleted successfully")
       } catch (error) {

          res.status(500).json(error);
        
       } 
    }

}

// follow a user 
export const followuser =  async (req,res) => {
    const id = req.params.id;

    const {currentUserid}  = req.body

    if(currentUserid === id)
    {
        res.status(403).json("forbidden")
    }
    else{
        try {
            const followUser = User.findById(id)
            const followingUSer = User.findById(currentUserid);     
            
            
            if(!followUser.followers.includes(currentUserid))
            {
                await followUser.updateOne({$push:{followers:currentUserid}})
                await followingUSer.updateOne({$push:{following:id}})
                res.status(200).json("User followed!")
            }
            else{
                res.status(403).json("user is already followed by you ")
            }
        } catch (error) {
            res.status(500).json(error); 
        }
    }
}


// unfollow user

export const unfollowuser =  async (req,res) => {
    const id = req.params.id;

    const {currentUserid}  = req.body

    if(currentUserid === id)
    {
        res.status(403).json("forbidden")
    }
    else{
        try {
            const followUser = User.findById(id)
            const followingUSer = User.findById(currentUserid);     
            
            
            if(!followUser.followers.includes(currentUserid))
            {
                await followUser.updateOne({$pull:{followers:currentUserid}})
                await followingUSer.updateOne({$pull:{following:id}})
                res.status(200).json("User unfollowed!")
            }
            else{
                res.status(403).json("user is not followed by you ")
            }
        } catch (error) {
            res.status(500).json(error); 
        }
    }
}