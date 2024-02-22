import { RequestHandler } from "express";
import MessageModel from "../Models/message";
import createHttpError, { isHttpError } from "http-errors";
import mongoose, { Document, Model } from 'mongoose';


export const getMessages: RequestHandler =  async (req,res, next)=>{
    try{
     const Messages = await MessageModel.find().exec();
     res.status(200).json(Messages);
    }catch(error){
        next(error);
    }
    
};

export const getMessage: RequestHandler = async (req,res,next) => {
    const messageId = req.params.blogId;
     try{
         if (!mongoose.isValidObjectId(messageId)){
             throw createHttpError(400,"Invalid Message Id");
         }
 
        const Message = await MessageModel.findById(messageId).exec();
 
        if(!Message){
         throw createHttpError(404,"Message not found");
        }
        res.status(200).json(Message);
     }catch(error){
         next(error);
     }
 };

interface CreateMessageBody{
    name?: string,
    email?: string,
    content?: string,
}
export const createMessages: RequestHandler<unknown, unknown, CreateMessageBody, unknown> = async(req,res,next)=>{
    const name = req.body.name;
    const email  = req.body.email;
    const content = req.body.content;

    try{
        if (!name){
            throw createHttpError(400, "Fill all places")
        }

        const newMessage = await MessageModel.create({
            name: name,
            email: email,
            content: content,

        });
            
       res.status(201).json(newMessage);
    }catch (error){
            next(error);
        }
    };

    export const deleteMessage: RequestHandler = async(req, res, next)=>{
        const messageId = req.params.blogId;
    
        try{
            if (!mongoose.isValidObjectId(messageId)){
                throw createHttpError(400,"Invalid message Id");
            }
    
            const Message = await MessageModel.findById(messageId).exec();
    
            if(!Message){
                throw createHttpError(204,"No content");
            }
               
            await Message.deleteOne();
            res.sendStatus(204);
        }catch(error){
            next(error);
        }
          
    };
    