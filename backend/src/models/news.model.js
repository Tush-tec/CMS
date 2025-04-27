import mongoose, { mongo, Schema } from "mongoose";




const newsSchema = new Schema(
    {
        title  :{
            type : String,
            required : true,
            index : true
        },
        content : {
            type : String,
            required: true
        },
        author :{
            type : mongoose.Types.ObjectId,
            ref : "User",
        },
        category : {
            type : mongoose.Types.ObjectId,
            ref : "Category"
        },
        image : {
            type : String,
            required : true
        },
        views : {
            type  :Number,
        },
        comments : {
            type : mongoose.Types.ObjectId,
            ref : "Comment"
        }
    },
    {
        timestamps : true
    }
)

export const News = mongoose.model("News", newsSchema)