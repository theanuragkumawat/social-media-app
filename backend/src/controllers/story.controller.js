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
import { Story } from "../models/story.model.js";

const createStory = asyncHandler(async (req, res) => {
   const { mentions } = req.body;

   const mediaLocalPath = req.file?.path;
   if (!mediaLocalPath) {
      throw new ApiError(400, "Media file is required");
   }

   const media = await uploadOnCloudinary(mediaLocalPath);
   if (!media) {
      throw new ApiError(500, "Something went wrong while uploading media");
   }

   const story = await Story.create({
      media: media.url,
      mentions: mentions,
      owner: req.user?._id,
   });

   if (!story) {
      throw new ApiError(500, "something went wrong while creating story");
   }

   return res
      .status(200)
      .json(new ApiResponse(200, story, "story created successfully"));
});

const getAllFeedStories = asyncHandler(async (req, res) => {
   const userId = req.user?._id;

   const stories = await Follow.aggregate([
      {
         $match: {
            follower: new mongoose.Types.ObjectId(userId),
         },
      },
      {
         $lookup: {
            from: "stories",
            foreignField: "owner",
            localField: "followee",
            as: "userStories",
            pipeline: [
               {
                  $match: {
                     status: "public",
                  },
               },
               {
                  $sort: { createdAt: -1 },
               },
            ],
         },
      },
      {
         $match: {
            "userStories.0": { $exists: true },
         },
      },
        {
            $lookup: {
                from: "users",
                foreignField: "_id",
                localField: "followee",
                as: "ownerInfo",
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
        {
            $project: {
                _id: 0, // Exclude the default _id
                user: { $first: "$ownerInfo" }, // Convert the single-element ownerInfo array into an object
                stories: "$userStories",
            },
        },
   ]);

    if (!stories) {
        throw new ApiError(500, "Something went wrong while fetching the story feed");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, stories, "Story feed fetched successfully"));

});

const getUserStories = asyncHandler(async (req, res) => {
   const { userId } = req.params;

   if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new ApiError(400, "user id not valid");
   }

   const stories = await Story.aggregate([
      {
         $match: {
            owner: new mongoose.Types.ObjectId(userId),
            status: "public",
         },
      },
      { $sort: { createdAt: -1 } },
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
                  },
               },
            ],
         },
      },
      {
         $lookup: {
            from: "users",
            foreignField: "_id",
            localField: "recentViewers",
            as: "recentViewers",
            pipeline: [
               {
                  $project: {
                     username: 1,
                     fullname: 1,
                     avatar: 1,
                  },
               },
            ],
         },
      },
      {
         $unwind: "$owner",
      },
   ]);

   if (!stories) {
      throw new ApiError(500, "something went wrong while fetching stories");
   }

   return res
      .status(200)
      .json(new ApiResponse(200, stories, "Stories fetched successfully"));
});

const deleteStory = asyncHandler(async (req, res) => {
   const { storyId } = req.params;

   if (!mongoose.Types.ObjectId.isValid(storyId)) {
      throw new ApiError(400, "Story id not valid");
   }

   const story = await Story.findByIdAndDelete(storyId);

   if (!story) {
      throw new ApiError(500, "Something went wrong while deleting story");
   }

   return res
      .status(200)
      .json(new ApiResponse(200, story, "Story deleted successfully"));
});

const viewStory = asyncHandler(async (req, res) => {
   const { storyId } = req.params;

   if (!mongoose.Types.ObjectId.isValid(storyId)) {
      throw new ApiError(400, "Invalid storyId");
   }

   const view = await Story.updateOne(
      {
         _id: storyId,
         recentViewers: { $ne: req.user?._id },
      },
      { $push: { recentViewers: req.user?._id } }
   );

   if (!view) {
      return res
         .status(200)
         .json(new ApiResponse(200, null, "User already viewed this story"));
   }

   return res
      .status(200)
      .json(new ApiResponse(200, null, "Story view recorded successfully"));
});

export { createStory, getUserStories, deleteStory, viewStory,getAllFeedStories };
