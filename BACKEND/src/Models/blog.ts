import {InferSchemaType,model,Schema} from "mongoose";

const blogSchema = new Schema({
   title: { type: String, required:true},
   text:  {type:String, required:true},
}, {timestamps: true});

type Blog = InferSchemaType<typeof blogSchema>;

export default model<Blog>("Blog",blogSchema);