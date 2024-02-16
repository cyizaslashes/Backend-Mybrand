import express from "express";
import * as BlogsControllers from "../controllers/blogs";

const router = express.Router();
router.get("/",BlogsControllers.getBlogs);
router.get("/:blogId",BlogsControllers.getBlog);
router.post("/", BlogsControllers.createBlogs);
router.patch("/:blogId", BlogsControllers.updateBlog);
router.delete("/:blogId",BlogsControllers.deleteBlog);

export default router;