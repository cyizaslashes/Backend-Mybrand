import { RequestHandler } from "express";
import createHttpError from "http-errors";


export const requiresAuth: RequestHandler = (req,res,next)=>{
      if (req.session.userId){
        next();
      }else{
        next(createHttpError(401, "user not authenticated"));
      }
};

/**
 * export const getAuthenticatedUser: RequestHandler = async(req,res,next)=>{

     try{
          const user = await UserModel.findById(req.session.userId).select("+email").exec();
          res.status(200).json(user);

     }catch(error){
         next(error);
     }
}
 */