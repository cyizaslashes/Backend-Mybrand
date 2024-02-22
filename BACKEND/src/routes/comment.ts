import  express from "express";
import * as CommentController from "../controllers/comment";
import { requiresAuth } from "../middleware/auth";
const router = express.Router();

router.get("/",CommentController.getComments);
router.post("/",requiresAuth,CommentController.createComments);
router.patch("/:commentId",CommentController.updateComment);
router.delete("/:commentId",CommentController.deleteComment)

export default router;