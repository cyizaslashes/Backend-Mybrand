import { RequestHandler } from "express";
import Blogmodel from "../Models/blog"
import createHttpError, { isHttpError } from "http-errors";
import mongoose, { Document, Model } from 'mongoose';


export const getBlogs: RequestHandler =  async (req,res, next)=>{
    try{
     const blogs = await Blogmodel.find().exec();
     res.status(200).json(blogs);
    }catch(error){
        next(error);
    }
    
};
export const getBlog: RequestHandler = async (req,res,next) => {
   const blogId = req.params.blogId;
    try{
        if (!mongoose.isValidObjectId(blogId)){
            throw createHttpError(400,"Invalid blog Id");
        }

       const blog = await Blogmodel.findById(blogId).exec();

       if(!blog){
        throw createHttpError(404,"Blog not found");
       }
       res.status(200).json(blog);
    }catch(error){
        next(error);
    }
};

interface CreatBlogBody{
    title?: string,
    text?: string,
}

export const createBlogs: RequestHandler<unknown, unknown, CreatBlogBody, unknown> = async(req,res,next)=>{
    const title = req.body.title;
    const text  = req.body.text;
    try{
        if (!title){
            throw createHttpError(400, "A blog must have a title")
        }

        const newBlog = await Blogmodel.create({
            title: title,
            text: text,

        });
            
       res.status(201).json(newBlog);
    }catch (error){
            next(error);
        }
    };

    interface UpdateBlogParams{
        blogId: string,
    }
    interface UpdateBlogBody{
        title?: string,
        text?:  string,
    }

    export const updateBlog: RequestHandler<UpdateBlogParams,unknown,UpdateBlogBody,unknown> = async(req,res,next)=>{
        const blogId = req.params.blogId;
        const newTitle = req.body.title;
        const newText = req.body.text;  

        try{
            if (!mongoose.isValidObjectId(blogId)){
                throw createHttpError(400,"Invalid blog Id");
            }
            if (!newTitle){
                throw createHttpError(400, "A blog must have a title")
            }
       
            const blog = await Blogmodel.findById(blogId).exec();
            
            if(!blog){
                throw createHttpError(404,"Blog not found");
               }
              
               blog.title = newTitle;
               blog.text =  newText ?? ''; // Assign an empty string if newText is undefined
               
               
               const updatedBlog = await blog.save();

               res.status(200).json(updatedBlog);
           }catch(error){
               
           }
    };

export const deleteBlog: RequestHandler = async(req, res, next)=>{
    const blogId = req.params.blogId;

    try{
        if (!mongoose.isValidObjectId(blogId)){
            throw createHttpError(400,"Invalid blog Id");
        }

        const blog = await Blogmodel.findById(blogId).exec();

        if(!blog){
            throw createHttpError(204,"No content");
        }
           
        await blog.deleteOne();
        res.sendStatus(204);
    }catch(error){
        next(error);
    }
      
};

