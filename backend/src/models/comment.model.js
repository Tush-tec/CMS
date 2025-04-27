import mongoose, { Schema } from "mongoose";


const commentSchema = new Schema(
    {
        article :{
            type : String,
        },
        user : {
            type : mongoose.Types.ObjectId,
            ref :"user"
        },
        content : {
            type : mongoose.Types.ObjectId,
            ref : "News"
        }
    },
    {
        timestamps: true
    }
    
)

export const Comment = mongoose.model("Comment", commentSchema) 