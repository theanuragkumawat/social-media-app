import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { Post } from "../models/post.model.js";
import { Follow } from "../models/follow.model.js";
import mongoose from "mongoose";
import { User } from "../models/user.model.js";
import { Comment } from "../models/comment.model.js";
import { Like } from "../models/like.model.js";

// for post
const likePost = asyncHandler(async (req,res) => {

    const { postId } = req.params

    if(!mongoose.Types.ObjectId.isValid(postId)){
        throw new ApiError(400,"Invalid post id")
    }

    const like = await Like.create({
        likedBy: req.user?._id,
        targetType: "post",
        targetId: postId
    })

    await Post.findByIdAndUpdate(postId,
        {
            $inc: { totalLikes:1 }
        }
    )

    if(!like){
        throw new ApiError(500,"Something went wrong while like the post")
    }

    return res.status(200).json(new ApiResponse(200,like,"Post liked successfully"))

})

const unlikePost = asyncHandler(async (req,res) => {

    const { postId } = req.params

    if(!mongoose.Types.ObjectId.isValid(postId)){
        throw new ApiError(400,"Invalid post id")
    }

    const unlike = await Like.findOneAndDelete({ targetId: postId, likedBy: req.user?._id })

    await Post.findByIdAndUpdate(postId,
        {
            $inc: { totalLikes: -1 }
        }
    )

    if(!unlike){
        throw new ApiError(500,"Something went wrong while unlike the post")
    }

    return res.status(200).json(new ApiResponse(200,unlike,"Post unliked successfully"))

})

const getAllPostLikes = asyncHandler(async (req,res) => {
    const { postId } = req.params
    const page = parseInt(req.query.page) > 0 ? parseInt(req.query.page) : 1;
    const limit = parseInt(req.query.limit) > 0 ? parseInt(req.query.limit) : 10;


    if(!mongoose.Types.ObjectId.isValid(postId)){
        throw new ApiError(400,"Invalid post id")
    }

    const likesAggregate = Like.aggregate([
        {
            $match: {
                targetType: "post",
                targetId: new mongoose.Types.ObjectId(postId)
            }
        },
        {
            $lookup: {
                from: "users",
                foreignField: "_id",
                localField: "likedBy",
                as: "likedBy",
                pipeline: [
                    {
                        $project: {
                            username: 1,
                            fullname: 1,
                            avatar:1
                        }
                    }
                ]
            }
        },
        { $unwind: "$likedBy" },
        {
         $replaceRoot: { newRoot: "$likedBy" }
        },
    ])

    const likes = await Like.aggregatePaginate(likesAggregate,{ page: page, limit: limit })

    if(!likes){
        throw new ApiError(500,"Something went wrong while getting likes")
    }

    return res.status(200).json(new ApiResponse(200,likes,"Post likes fetched successfully"))

})

//for comment

const likeComment = asyncHandler(async (req,res) => {
    const { commentId } = req.params

    if(!mongoose.Types.ObjectId.isValid(commentId)){
        throw new ApiError(400,"Invalid comment id")
    }

    const like = await Like.create(
        {
            likedBy: req.user?._id,
            targetType: "comment",
            targetId: commentId
        }
    )

    await Comment.findByIdAndUpdate(commentId,
        {
            $inc: { totalLikes: 1 }
        }
    )

    if(!like){
        throw new ApiError(500,"Something went wrong while like the comment")
    }

    return res.status(200).json(new ApiResponse(200,like,"Comment liked successfully"))

})

const unlikeComment = asyncHandler(async (req,res) => {
    const { commentId } = req.params

    if(!mongoose.Types.ObjectId.isValid(commentId)){
        throw new ApiError(400,"Invalid comment id")
    }

    const unlike = await Like.findOneAndDelete({ likedBy: req.user?._id,targetId: commentId  })

    await Comment.findByIdAndUpdate(commentId,
        {
            $inc: { totalLikes: -1 }
        }
    )

    if(!unlike){
        throw new ApiError(500,"Something went wrong while unlike the comment")
    }

    return res.status(200).json(new ApiResponse(200,unlike,"Comment unliked successfully"))
})

// for story

const likeStory = asyncHandler(async (req,res) => {
    const { storyId } = req.params

    if(!mongoose.Types.ObjectId.isValid(storyId)){
        throw new ApiError(400,"Invalid story id")
    }

    const like = await Like.create(
        {
            likedBy: req.user?._id,
            targetType: "story",
            targetId: storyId
        }
    )

    await Comment.findByIdAndUpdate(storyId,
        {
            $inc: { totalLikes: 1 }
        }
    )

    if(!like){
        throw new ApiError(500,"Something went wrong while like the story")
    }

    return res.status(200).json(new ApiResponse(200,like,"Story liked successfully"))

})

const unlikeStory = asyncHandler(async (req,res) => {
    const { storyId } = req.params

    if(!mongoose.Types.ObjectId.isValid(storyId)){
        throw new ApiError(400,"Invalid story id")
    }

    const unlike = await Like.findOneAndDelete({ likedBy: req.user?._id,targetId: storyId  })

    await Comment.findByIdAndUpdate(storyId,
        {
            $inc: { totalLikes: -1 }
        }
    )

    if(!unlike){
        throw new ApiError(500,"Something went wrong while unlike the story")
    }

    return res.status(200).json(new ApiResponse(200,unlike,"Story unliked successfully"))
})

export {
    likePost,
    unlikePost,
    getAllPostLikes,
    likeComment,
    unlikeComment,
    likeStory,
    unlikeStory
}