import "dotenv/config";
import express, { NextFunction,Request,Response } from "express";
import blogroutes from "../src/routes/blogs";
import messageRoutes from "../src/routes/message";
import userRoutes from "../src/routes/users";
import createHttpError, {isHttpError} from "http-errors";
import session from "express-session";
import env from "./util/validatenv";
import MongoStore from "connect-mongo";
import getusertestRoute from "../src/routes/getAllusers";
import { requiresAuth } from "./middleware/auth";
import CommentRoutes from "../src/routes/comment";
import limiter  from "express-rate-limit"
//import morgan  from "morgan";


const app = express();
//app.use(morgan("dev"));
app.use(express.json());

    app.use(session({
    secret: env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { 
        maxAge: 60*60*1000,
    },
    rolling: true,
    store: MongoStore.create({
        mongoUrl: env.MONGO_CONNECTION_STRING
    }),
}));



const RateLimit = limiter({
    windowMs: 30 * 60 * 1000,
    max: 100,
    message: 'Too many requests from this IP, please try again in 30 minutes.'
});
app.use("/api",RateLimit)
app.use("/api/blogs",blogroutes);
app.use("/api/users", userRoutes);
app.use("/api/message", messageRoutes);
app.use("/api/test/",getusertestRoute);
app.use("/api/comments",CommentRoutes);

app.use((req, res, next)=>{
    next(createHttpError(404,"Endpoint not found"));
});


app.use((error: unknown, req: Request, res: Response, next: NextFunction)=>{
           console.error(error);
           let errorMessage = "An unknown error occured";
           let statuscode = 500;
           if (isHttpError(error)){
            statuscode = error.status;
            errorMessage = error.message;
           }
           res.status(statuscode).json({error: errorMessage});
});

export default app;