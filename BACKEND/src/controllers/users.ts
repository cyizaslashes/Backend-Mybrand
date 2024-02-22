import { RequestHandler } from "express";
import createHttpError from "http-errors";
import { InferSchemaType } from "mongoose";
import UserModel from "../Models/user";
import bcrypt from "bcrypt";
import session from "express-session";
import jwt from "jsonwebtoken"

export const getAuthenticatedUser: RequestHandler = async(req,res,next)=>{

     try{
          const user = await UserModel.findById(req.session.userId).select("+email").exec();
          res.status(200).json(user);

     }catch(error){
         next(error);
     }
}

interface SignUpBody{
    username?: string,
    email?: string,
    password?: string,
}
export const signUp: RequestHandler<unknown, unknown, SignUpBody, unknown> = async (req,res,next) =>{
     const username = req.body.username;
     const email = req.body.email;
     const passwordRaw = req.body.password;

     try{
        if(!username || !email || !passwordRaw){
            throw createHttpError(400,"Some information is missing!");
        }

        const existingUsername = await UserModel.findOne({username: username}).exec();

        if (existingUsername){
            throw createHttpError(409,"Username already taken please use another one");
        }

        const existingEmail = await UserModel.findOne({email: email}).exec();
        
        if (existingEmail){
            throw createHttpError(409,"The user with this email exists please login instead");
        }
       
        const passwordHashed = await bcrypt.hash(passwordRaw, 10);

        const newUser = await UserModel.create({
            username : username,
            email: email,
            password: passwordHashed,
        });


       req.session.userId = newUser._id;
       //omitting password in the response
       const { password, ...userWithoutPassword } = newUser.toObject();
       res.status(201).json(userWithoutPassword);
     }catch(error){
          next(error);
     }
};

interface LoginBody{
    username?: string,
    password?: string,
}
export const  login:RequestHandler< unknown,unknown,LoginBody,unknown> = async (req,res,next)=>{
    const username = req.body.username;
    const passwordInput = req.body.password;
    try{
          if(!username || !passwordInput){
             throw createHttpError(400,"Parameters missing");
          }
          const user = await UserModel.findOne({username: username}).select("+password +email").exec();

          if(!user){
            throw createHttpError(401,"Invalid Credentials");
          }

          const passwordMatch = await bcrypt.compare(passwordInput,user.password);
          if(!passwordMatch){
            throw createHttpError(401,"Invalid Credentials");
          }

          req.session.userId = user._id;
          //omitting password in the response
       const { password, ...userWithoutPassword } = user.toObject();
       res.status(201).json(userWithoutPassword);
    }catch(error){
         next(error);
    }
};

export const logout: RequestHandler = (req,res,next)=>{
    req.session.destroy(error=>{
        if (error){
            next(error);
        }else{
            res.sendStatus(200);
        }
    });
}