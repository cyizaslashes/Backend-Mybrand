import {InferSchemaType,model,Schema} from "mongoose";

const commentSchema = new Schema({
   userId: {type: Schema.Types.ObjectId, required: true},
   description : {type:String, required:true}
}, {timestamps: true});

type Comment = InferSchemaType<typeof commentSchema>;

export default model<Comment>("Comment",commentSchema);