import { RequestHandler } from "express";
import CommentModel from "../Models/comment";
import createHttpError, { isHttpError } from "http-errors";
import mongoose, { Document, Model } from 'mongoose';
import { assertisDefined } from "../util/assertisDefined";

export const getComments: RequestHandler =  async (req,res, next)=>{
    try{
     const Comments = await CommentModel.find().exec();
     res.status(200).json(Comments);
    }catch(error){
        next(error);
    }
    
};

interface CreatCommentBody{
    description?: string,
}

export const createComments: RequestHandler<unknown, unknown, CreatCommentBody, unknown> = async(req,res,next)=>{
    const description  = req.body.description;
    const authenticatedUserId = req.session.userId;

    try{
        assertisDefined(authenticatedUserId);

        if (!description){
            throw createHttpError(400, "A comment must have a description")
        }

        const newComment = await CommentModel.create({
            userId: authenticatedUserId,
            description: description,

        });
            
       res.status(201).json(newComment);
    }catch (error){
            next(error);
        }
    };

    interface UpdateCommentParams{
        commentId: string,
    }
    interface UpdateCommentBody{
        description?: string,
    }

    export const updateComment: RequestHandler<UpdateCommentParams,unknown,UpdateCommentBody,unknown> = async(req,res,next)=>{
        const commentId = req.params.commentId;
        const newdescription = req.body.description;
        const authenticatedUserId = req.session.userId;

        try{
            assertisDefined(authenticatedUserId);
            
            if (!mongoose.isValidObjectId(commentId)){
                throw createHttpError(400,"Invalid Comment Id");
            }
            if (!newdescription){
                throw createHttpError(400, "A Comment must have a content")
            }
       
            const comment = await CommentModel.findById(commentId).exec();
            
            if(!comment){
                throw createHttpError(404,"Blog not found");
               }

            if(!comment.userId.equals(authenticatedUserId)){
                throw createHttpError(401, "You can't access this comment")
               }
              
               comment.description = newdescription;
               
               
               const updatedComment = await comment.save();

               res.status(200).json(updatedComment);
           }catch(error){
               
           }
    };

    export const deleteComment: RequestHandler = async(req, res, next)=>{
        const commentId = req.params.commentId;
        const authenticatedUserId = req.session.userId;
    
        try{
            assertisDefined(authenticatedUserId);
    
            if (!mongoose.isValidObjectId(commentId)){
                throw createHttpError(400,"Invalid comment Id");
            }
    
            const comment = await CommentModel.findById(commentId).exec();
    
            if(!comment){
                throw createHttpError(404,"No content");
            }
    
            if(!comment.userId.equals(authenticatedUserId)){
                throw createHttpError(401, "You can't access this Blog")
               }
               
            await comment.deleteOne();
            res.sendStatus(204);
        }catch(error){
            next(error);
        }
          
    };
    



