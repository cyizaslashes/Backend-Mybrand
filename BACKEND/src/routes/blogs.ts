import express from "express";
import * as BlogsControllers from "../controllers/blogs";
import { requiresAuth } from "../middleware/auth";

const router = express.Router();
router.get("/",BlogsControllers.getAllBlogs);
router.get("/:blogId",requiresAuth,BlogsControllers.getBlog);
router.post("/", requiresAuth,BlogsControllers.createBlogs);
router.patch("/:blogId",requiresAuth,BlogsControllers.updateBlog);
router.delete("/:blogId", requiresAuth, (req, res, next) => BlogsControllers.deleteBlog(req, res, next));

export default router;