import express  from "express";
import {deleteuser, followuser, getuser, unfollowuser, updateuser} from "../controllers/user.js"


const router = express.Router();


router.get("/:id",getuser);
router.put("/:id",updateuser)
router.delete("/:id",deleteuser)
router.put("/:id/follow",followuser)
router.put("/:id/follow",unfollowuser)


export default router