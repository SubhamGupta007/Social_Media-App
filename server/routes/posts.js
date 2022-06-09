import express from "express";
import { createpost, deletePost, getpost, getTimelinePosts, likepost, updatepost } from "../controllers/post.js";

const router = express.Router();


router.post('/create',createpost)
router.get('/getpost/:id',getpost)
router.put('/:id', updatepost)
router.delete('/:id', deletePost)
router.put("/:id/like",likepost);
router.get("/:id/timeline", getTimelinePosts)


export default router