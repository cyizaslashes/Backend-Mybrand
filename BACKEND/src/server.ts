import app from "./app"
import env from "./util/validatenv";
import mongoose from "mongoose";




const port = env.PORT;

mongoose.connect(env.MONGO_CONNECTION_STRING)
.then(()=>{
    console.log("Mongoose connected");
    app.listen(port,()=>{
        console.log("server running:"+ port);
    });
})

.catch(console.error);
