import mongoose from "mongoose";

const likeSchema = new mongoose.Schema(
    {
        likedBy:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'User'
        },
        targetType:{
            type:String,
            enum: ["post", "comment", "story"],
            required:true
        },
        targetId:{
            type: mongoose.Schema.Types.ObjectId,
            required:true,
            index: true
        }
    },
    {
        timestamps:true
    }
)

export const Like = mongoose.model('Like',likeSchema)