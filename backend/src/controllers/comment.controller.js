import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { Post } from "../models/post.model.js";
import { Follow } from "../models/follow.model.js";
import mongoose from "mongoose";
import { User } from "../models/user.model.js";
import { Comment } from "../models/comment.model.js";

const addComment = asyncHandler(async (req, res) => {
   const { postId } = req.params;
   const { text, parent } = req.body;

   if (
      !mongoose.Types.ObjectId.isValid(postId) ||
      (parent && !mongoose.Types.ObjectId.isValid(parent))
   ) {
      throw new ApiError(400, "Invalid IDs");
   }

   if (parent) {
      const comment = await Comment.create({
         text: text,
         owner: req.user?._id,
         post: postId,
         parent: parent,
      });

      await Post.findByIdAndUpdate(postId,
         {
            $inc: { totalComments: 1 }
         }
      )

      if (!comment) {
         throw new ApiError(500, "Something went wrong while adding reply");
      }

      return res
         .status(201)
         .json(new ApiResponse(201, comment, "Reply added successfully"));
   } else {
      const comment = await Comment.create({
         text: text,
         owner: req.user?._id,
         post: postId,
      });

      await Post.findByIdAndUpdate(postId,
         {
            $inc: { totalComments: 1 }
         }
      )

      if (!comment) {
         throw new ApiError(500, "Something went wrong while adding comment");
      }

      return res
         .status(201)
         .json(new ApiResponse(201, comment, "Comment added successfully"));
   }
});

const getComments = asyncHandler(async (req, res) => {
   const { postId } = req.params;
   const page = parseInt(req.query.page) > 0 ? parseInt(req.query.page) : 1;
   const limit = parseInt(req.query.limit) > 0 ? parseInt(req.query.limit) : 10;
   //    const skip = (page - 1) * limit;

   if (!mongoose.Types.ObjectId.isValid(postId)) {
      throw new ApiError(400, "Invalid post id");
   }

   const commentsAggregate = Comment.aggregate([
      {
         $match: {
            post: new mongoose.Types.ObjectId(postId),
            parent: null,
         },
      },
      {
         $sort: { createdAt: -1 },
      },
      {
         $lookup: {
            from: "comments",
            foreignField: "parent",
            localField: "_id",
            as: "replies",
            pipeline: [
               {
                  $lookup: {
                     from: "users",
                     foreignField: "_id",
                     localField: "owner",
                     as: "owner",
                     pipeline: [
                        {
                           $project: {
                              username: 1,
                              avatar: 1,
                              fullname: 1,
                           },
                        },
                     ],
                  },
               },
               { $unwind: "$owner" },
               { $sort: { createdAt: 1 } },
            ],
         },
      },
      {
         $lookup: {
            from: "users",
            foreignField: "_id",
            localField: "owner",
            as: "owner",
            pipeline: [
               {
                  $project: {
                     username: 1,
                     avatar: 1,
                     fullname: 1,
                  },
               },
            ],
         },
      },
      { $unwind: "$owner" },
   ]);

   const comments = await Comment.aggregatePaginate(commentsAggregate, {
      page: page,
      limit: limit,
   });

   return res
      .status(200)
      .json(new ApiResponse(200, comments, "Comments fetched successfully"));
});

const editComment = asyncHandler(async (req, res) => {
   const { commentId } = req.params;
   const { text } = req.body;

   if (!mongoose.Types.ObjectId.isValid(commentId)) {
      throw new ApiError(400, "Invalid comment id");
   }

   const comment = await Comment.findByIdAndUpdate(commentId, {
      text: text,
      isEdited: true,
   });

   if (!comment) {
      throw new ApiError(500, "Something went wrong while editing comment");
   }

   return res
      .status(200)
      .json(new ApiResponse(200, comment, "Comment edited successfully"));
});

const deleteComment = asyncHandler(async (req, res) => {
   const { postId, commentId } = req.params;

   if (!mongoose.Types.ObjectId.isValid(commentId)) {
      throw new ApiError(400, "Invalid comment id");
   }

   const comment = await Comment.findByIdAndDelete(commentId);

   await Post.findByIdAndUpdate(postId,
      {
         $inc: { totalComments: -1 }
      }
   )

   if (!comment) {
      throw new ApiError(500, "Something went wrong while deleting comment");
   }

   return res
      .status(200)
      .json(new ApiResponse(200, comment, "Comment deleted successfully"));
});

// const getCommentById = asyncHandler(async (req, res) => {
//    const { postId, commentId } = req.params;

//    if (
//       !mongoose.Types.ObjectId.isValid(postId) ||
//       !mongoose.Types.ObjectId.isValid(commentId)
//    ) {
//       throw new ApiError(400, "Invalid IDs");
//    }
// });

export { addComment, getComments, editComment, deleteComment };
