import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { Post } from "../models/post.model.js";
import { Follow } from "../models/follow.model.js";
import mongoose from "mongoose";
import { User } from "../models/user.model.js";

const toggleFollow = asyncHandler(async (req, res) => {
   const { userId } = req.params;

   if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new ApiError(400, "userId is not valid");
   }

   const existingFollower = await Follow.findOne({
      follower: req.user?._id,
      followee: userId,
   });

   if (existingFollower) {
      const follow = await Follow.findOneAndDelete({
         follower: req.user?._id,
         followee: userId,
      });

      await User.findByIdAndUpdate(userId, {
         $inc: { followersCount: -1 },
      });
      await User.findByIdAndUpdate(req.user?._id, {
         $inc: { followingCount: -1 },
      });

      if (!follow) {
         throw new ApiError(500, "Something went wrong while unfollowing user");
      }

      return res
         .status(200)
         .json(new ApiResponse(200, follow, "User successfully unfollowed"));
   } else {
      const follow = await Follow.create({
         follower: req.user?._id,
         followee: userId,
      });

      await User.findByIdAndUpdate(userId, {
         $inc: { followersCount: 1 },
      });
      await User.findByIdAndUpdate(req.user?._id, {
         $inc: { followingCount: 1 },
      });

      if (!follow) {
         throw new ApiError(500, "Something went wrong while following user");
      }

      return res
         .status(200)
         .json(new ApiResponse(200, follow, "User successfully followed"));
   }
});

const getFollowers = asyncHandler(async (req, res) => {
   const { userId } = req.params;
   const page = parseInt(req.query.page) > 0 ? parseInt(req.query.page) : 1;
   const limit = parseInt(req.query.limit) > 0 ? parseInt(req.query.limit) : 5;

   if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new ApiError(400, "userId is not valid");
   }

   const followersAggregate = Follow.aggregate([
      {
         $match: {
            followee: new mongoose.Types.ObjectId(userId),
         },
      },
      {
         $lookup: {
            localField: "follower",
            from: "users",
            foreignField: "_id",
            as: "follower",
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
                     },
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
         $addFields: {
            follower: {
               $first: "$follower",
            },
         },
      },
      {
         $replaceRoot: { newRoot: "$follower" },
      },
   ]);

   const followers = await Follow.aggregatePaginate(followersAggregate, {
      page: page,
      limit: limit,
   });

   return res
      .status(200)
      .json(new ApiResponse(200, followers, "followers fetched successfully"));
});

const getFollowing = asyncHandler(async (req, res) => {
   const { userId } = req.params;
   const page = parseInt(req.query.page) > 0 ? parseInt(req.query.page) : 1;
   const limit = parseInt(req.query.limit) > 0 ? parseInt(req.query.limit) : 5;

   if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new ApiError(400, "userId is not valid");
   }

   const followingAggregate = Follow.aggregate([
      {
         $match: {
            follower: new mongoose.Types.ObjectId(userId),
         },
      },
      {
         $lookup: {
            from: "users",
            foreignField: "_id",
            localField: "followee",
            as: "followee",
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
                     },
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
         $addFields: {
            followee: {
               $first: "$followee",
            },
         },
      },
      {
         $replaceRoot: { newRoot: "$followee" },
      },
   ]);

   const following = await Follow.aggregatePaginate(followingAggregate, {
      page: page,
      limit: limit,
   });

   return res
      .status(200)
      .json(new ApiResponse(200, following, "Following fetched successfully"));
});

const removeFollower = asyncHandler(async (req, res) => {
   const { userId } = req.params;

   const removeFollow = await Follow.findOneAndDelete({
      followee: req.user?._id,
      follower: userId,
   });

   await User.findByIdAndUpdate(userId, {
      $inc: { followingCount: -1 },
   });
   await User.findByIdAndUpdate(req.user?._id, {
      $inc: { followersCount: -1 },
   });

   if (!removeFollow) {
      throw new ApiError(500, "something went wrong while removing follower");
   }

   return res
      .status(200)
      .json(
         new ApiResponse(200, removeFollow, "Follower removed successfully")
      );
});

// const toggleFollow = asyncHandler(async (req,res) => {

// })

export { toggleFollow, getFollowers, getFollowing, removeFollower };
