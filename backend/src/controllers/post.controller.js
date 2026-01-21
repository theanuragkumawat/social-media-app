import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { Post } from "../models/post.model.js";
import mongoose from "mongoose";
import { User } from "../models/user.model.js";

const uploadPost = asyncHandler(async (req, res) => {
   const { type = "post", caption, location, mentions } = req.body;

   const urls = [];
   for (const file of req.files) {
      const result = await uploadOnCloudinary(file.path);
      urls.push(result.url);
   }

   if (!urls) {
      throw new ApiError(500, "Something went wrong while uploading media");
   }

   const post = await Post.create({
      caption: caption ? caption : "",
      location: location ? location : "",
      mentions: mentions ? mentions : undefined,
      owner: req.user?._id,
      media: urls,
      type: type,
   });

   if (post) {
      await User.updateOne(
         { _id: req.user?._id },
         {
            $inc: {
               postsCount: 1,
            },
         }
      );
   }

   const createdPost = await Post.findById(post._id);

   if (!createdPost) {
      throw new ApiError(500, "Something went wrong while publishing post");
   }

   return res
      .status(200)
      .json(new ApiResponse(200, createdPost, "Post published successfully"));
});

const getPostById = asyncHandler(async (req, res) => {
   const { postId } = req.params;

   if (!mongoose.Types.ObjectId.isValid(postId)) {
      throw new ApiError(400, "Invalid post id");
   }
   // without aggregate
   // const post = await Post.findById(postId)

   //with aggregate
   const post = await Post.aggregate([
      {
         $match: {
            _id: new mongoose.Types.ObjectId(postId),
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
                     fullname: 1,
                     avatar: 1,
                     followersCount: 1,
                     followingCount: 1,
                     isPrivate: 1,
                     isBlocked: 1,
                     isDisabled: 1,
                  },
               },
            ],
         },
      },
      {
         $lookup: {
            from: "users",
            foreignField: "_id",
            localField: "mentions",
            as: "mentions",
            pipeline: [
               {
                  $project: {
                     username: 1,
                     fullname: 1,
                     avatar: 1,
                     followersCount: 1,
                     followingCount: 1,
                     isPrivate: 1,
                     isBlocked: 1,
                     isDisabled: 1,
                  },
               },
            ],
         },
      },
      {
         $addFields: {
            owner: {
               $first: "$owner",
            },
         },
      },
   ]);

   if (!post) {
      throw new ApiError(500, "Post not found");
   }

   return res
      .status(200)
      .json(new ApiResponse(200, post, "Post fetched successfully"));
});

const getAllUserPosts = asyncHandler(async (req, res) => {
   const { userId } = req.params;
   const type = req.query.type;
   const page = parseInt(req.query.page) > 0 ? parseInt(req.query.page) : 1;
   const limit = parseInt(req.query.limit) > 0 ? parseInt(req.query.limit) : 5;
   const skip = (page - 1) * limit;

   if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new ApiError(400, "userId is not valid");
   }

   const posts = await Post.aggregate([
      {
         $match: {
            owner: new mongoose.Types.ObjectId(userId),
            type: type,
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
                  $lookup: {
                     from: "follows",
                     let: { userId: "$_id" },
                     pipeline: [
                        {
                           $match: {
                              $expr: {
                                 $and: [
                                    { $eq: ["$followee", "$$userId"] },
                                    {
                                       $eq: [
                                          "$follower",
                                          new mongoose.Types.ObjectId(
                                             req.user?._id
                                          ),
                                       ],
                                    },
                                 ],
                              },
                           },
                        },
                     ],
                     as: "isFollowing",
                  },
               },
               {
                  $addFields: {
                     isFollowing: {
                        $gt: [{ $size: "$isFollowing" }, 0],
                     }
                  },
               },
               {
                  $project: {
                     username: 1,
                     avatar: 1,
                     fullname: 1,
                     isFollowing: 1,
                  },
               },
            ],
         },
      },
      {
         $lookup: {
            from: "likes",
            let: { postId: "$_id" },
            pipeline: [
               {
                  $match: {
                     $expr: {
                        $and: [
                           { $eq: ["$targetId", "$$postId"] },
                           {
                              $eq: [
                                 "$likedBy",
                                 new mongoose.Types.ObjectId(req.user?._id),
                              ],
                           },
                        ],
                     },
                  },
               },
            ],
            as: "userLike",
         },
      },
      {
         $addFields: {
            hasLiked: {
               $gt: [{ $size: "$userLike" }, 0],
            },
            owner: { $first: "$owner" },
         },
      },
      {
         $project: {
            userLike: 0,
         },
      },
      {
         $sort: {
            createdAt: -1,
         },
      },
      {
         $skip: skip,
      },
      {
         $limit: limit,
      },
   ]);

   if (!posts) {
      throw new ApiError(500, "Something went wrong while retrieving posts");
   }

   return res
      .status(200)
      .json(new ApiResponse(200, posts, "Posts fetched successfully"));
});

const updatePost = asyncHandler(async (req, res) => {
   const { postId } = req.params;
   const { caption, location, mentions } = req.body;

   if (!mongoose.Types.ObjectId.isValid(postId)) {
      throw new ApiError(400, "postId is not valid");
   }

   const post = await Post.findByIdAndUpdate(
      postId,
      {
         caption: caption,
         location: location,
         mentions: mentions,
      },
      { new: true }
   );

   res.status(200).json(new ApiResponse(200, post, "Post updated sucessfully"));
});

const deletePost = asyncHandler(async (req, res) => {
   const { postId } = req.params;

   if (!mongoose.Types.ObjectId.isValid(postId)) {
      throw new ApiError(400, "postId is not valid");
   }

   const post = await Post.findByIdAndDelete(postId);

   if (post) {
      await User.updateOne(
         { _id: req.user?._id },
         {
            $inc: {
               postsCount: -1,
            },
         }
      );
   }

   if (!post) {
      throw new ApiError(500, "Something went wrong while deleting post");
   }

   return res
      .status(200)
      .json(new ApiResponse(200, post, "Post deleted successfully"));
});

const togglePostStatus = asyncHandler(async (req, res) => {
   const { postId } = req.params;

   if (!mongoose.Types.ObjectId.isValid(postId)) {
      throw new ApiError(400, "postId is not valid");
   }

   const post = await Post.findById(postId);

   // post.status = post.status == "public" ? "archive" : "public";
   if (post.status == "public") {
      post.status = "archive";
      await User.updateOne(
         { _id: req.user?._id },
         { $inc: { postsCount: -1 } }
      );
   } else {
      post.status = "public";
      await User.updateOne({ _id: req.user?._id }, { $inc: { postsCount: 1 } });
   }

   const updatedPost = await post.save({ validateBeforeSave: false });

   return res
      .status(200)
      .json(
         new ApiResponse(200, updatedPost, "Post toggle status successfully")
      );
});

export {
   uploadPost,
   getPostById,
   getAllUserPosts,
   updatePost,
   deletePost,
   togglePostStatus,
};
