import "dotenv/config";
import express, { NextFunction,Request,Response } from "express";
import blogroutes from "../src/routes/blogs";
import createHttpError, {isHttpError} from "http-errors";
//import morgan  from "morgan";

const app = express();
//app.use(morgan("dev"));
app.use(express.json());

app.use("/api/blogs", blogroutes);

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