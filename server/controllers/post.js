import Post from "../models/post.js";
import mongoose from "mongoose";
import User from "../models/user.js";


// create post 

export const createpost  = async(req,res) => {
    const newPost = new Post(req.body)

    
    try {

        await newPost.save();
        res.status("200").json("post created")
        
    } catch (error) {
        res.status(500).json(error);    
    }

}

// get post

export const getpost  = async(req,res) => {
    const id=req.params.id;
    try {
        const post = await Post.findById(id);
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json(error);  
    }
}

// update post
export const updatepost = async (req, res) => {
    const postId = req.params.id;
    const { userId } = req.body;
  
    try {
      const post = await Post.findById(postId);
      if (post.userId === userId) {
        await post.updateOne({ $set: req.body });
        res.status(200).json("Post Updated");
      } else {
        res.status(403).json("Action forbidden");
      }
    } catch (error) {
      res.status(500).json(error);
    }
};

// Delete a post
export const deletePost = async (req, res) => {
    const id = req.params.id;
    const { userId } = req.body;
  
    try {
      const post = await Post.findById(id);
      if (post.userId === userId) {
        await post.deleteOne();
        res.status(200).json("POst deleted successfully");
      } else {
        res.status(403).json("Action forbidden");
      }
    } catch (error) {
      res.status(500).json(error);
    }
  };

//   like/dislike  a post

export const likepost  = async(req,res) => {
    const id = req.params.id;
    const {userId} = req.body
    
    console.log(id);
    console.log(userId);
    try {

         const post = await Post.findById(id);
         if(!post.likes.includes(userId))
         {
          
            await post.updateOne({$push : {likes:userId}});
            res.status(200).json("Post liked");
         }
        
    } catch (error) {
        res.status(500).json(error);
    }
}

// get timeline post
// includes post of user as well as person whom he/she follows

export const getTimelinePosts = async (req, res) => {
    const userId = req.params.id;
  
    try {
      const currentUserPosts = await Post.find({ userId: userId });
      const followingPosts = await User.aggregate([
        {
          $match: {
            _id: new mongoose.Types.ObjectId(userId),
          },
        },
        {
          $lookup: {
            from: "posts",
            localField: "following",
            foreignField: "userId",
            as: "followingPosts",
          },
        },
        {
          $project: {
            followingPosts: 1,
            _id: 0,
          },
        },
      ]);
  
      res
        .status(200)
        .json(currentUserPosts.concat(...followingPosts[0].followingPosts)
        .sort((a,b)=>{
            return b.createdAt - a.createdAt;
        })
        );
    } catch (error) {
      res.status(500).json(error);
    }
  };