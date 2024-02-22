import {InferSchemaType,model,Schema} from "mongoose";

const messageSchema = new Schema({
   name: { type: String, required:true},
   email:  {type:String, required:true},
   content: {type:String, required:true}
}, {timestamps: true});

type Message = InferSchemaType<typeof messageSchema>;

export default model<Message>("Message",messageSchema);