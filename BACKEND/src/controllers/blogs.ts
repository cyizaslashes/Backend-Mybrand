import { RequestHandler } from "express";
import Blogmodel from "../Models/blog";
import createHttpError, { isHttpError } from "http-errors";
import mongoose, { Document, Model } from 'mongoose';
import { assertisDefined } from "../util/assertisDefined";
import { ParamsDictionary } from "express-serve-static-core";



export const getAllBlogs: RequestHandler =  async (req,res, next)=>{
    try{
        const Blogs = await Blogmodel.find().exec();
        res.status(200).json(Blogs);
    }catch(error){
        next(error);
    }
    
};
export const getBlog: RequestHandler = async (req,res,next) => {
   const blogId = req.params.blogId;
   const authenticatedUserId = req.session.userId;
    try{

        assertisDefined(authenticatedUserId);

        if (!mongoose.isValidObjectId(blogId)){
            throw createHttpError(400,"Invalid blog Id");
        }

       const blog = await Blogmodel.findById(blogId).exec();

       if(!blog){
        throw createHttpError(404,"Blog not found");
       }
       
       if(!blog.userId.equals(authenticatedUserId)){
        throw createHttpError(401, "You can't access this Blog")
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
    const authenticatedUserId = req.session.userId;

    try{
        assertisDefined(authenticatedUserId);

        if (!title){
            throw createHttpError(400, "A blog must have a title")
        }

        const newBlog = await Blogmodel.create({
            userId: authenticatedUserId,
            title: title,
            text: text,

        });
            
       res.status(201).json(newBlog);
    }catch (error){
            next(error);
        }
    };

    interface UpdateBlogParams extends ParamsDictionary{
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
        const authenticatedUserId = req.session.userId;

        try{
            assertisDefined(authenticatedUserId);
            
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

            if(!blog.userId.equals(authenticatedUserId)){
                throw createHttpError(401, "You can't access this Blog")
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
    const authenticatedUserId = req.session.userId;

    try{
        assertisDefined(authenticatedUserId);

        if (!mongoose.isValidObjectId(blogId)){
            throw createHttpError(400,"Invalid blog Id");
        }

        const blog = await Blogmodel.findById(blogId).exec();

        if(!blog){
            throw createHttpError(404,"No content");
        }

        if(!blog.userId.equals(authenticatedUserId)){
            throw createHttpError(401, "You can't access this Blog")
           }
           
        await blog.deleteOne();
        res.sendStatus(204);
    }catch(error){
        next(error);
    }
      
};

/**
 *  assertisDefined(authenticatedUserId);
        
     const blogs = await Blogmodel.find({userId:authenticatedUserId}).exec();
     res.status(200).json(blogs);
 */