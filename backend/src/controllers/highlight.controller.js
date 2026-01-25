import mongoose from "mongoose";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Highlight } from "../models/highlight.modal.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const createHighlight = asyncHandler(async (req, res) => {
   const { title, stories, cover } = req.body;
   

   const highlight = await Highlight.create({
      owner: req.user?._id,
      title,
      stories,
      cover,
   });

   return res
      .status(201)
      .json(new ApiResponse(201, highlight, "Highlight created successfully"));
});

const addStoryToHighlight = asyncHandler(async (req, res) => {
   const { highlightId, storyId } = req.params;
   if (!mongoose.Types.ObjectId.isValid(highlightId) || !mongoose.Types.ObjectId.isValid(storyId)) {
      throw new ApiError(400, "Invalid highlightId or storyId");
   }
    const highlight = await Highlight.findByIdAndUpdate(
      highlightId,
      { $addToSet: { stories: storyId } },
      { new: true }
   );
    if (!highlight) {
        throw new ApiError(404, "Highlight not found");
    }

   return res
      .status(200)
      .json(new ApiResponse(200, highlight, "Story added to highlight successfully"));
});

const removeStoryFromHighlight = asyncHandler(async (req, res) => {
   const { highlightId, storyId } = req.params;
   if (!mongoose.Types.ObjectId.isValid(highlightId) || !mongoose.Types.ObjectId.isValid(storyId)) {
      throw new ApiError(400, "Invalid highlightId or storyId");
   }

   const highlight = await Highlight.findByIdAndUpdate(
      highlightId,
      { $pull: { stories: storyId } },
      { new: true }
   );
   if (!highlight) {
      throw new ApiError(404, "Highlight not found");
   }

   return res
      .status(200)
      .json(new ApiResponse(200, highlight, "Story removed from highlight successfully"));
});

const getUserHighlights = asyncHandler(async (req, res) => {
   const { userId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new ApiError(400, "Invalid userId");
    }

   const highlights = await Highlight.aggregate([
      { $match: { owner: new mongoose.Types.ObjectId(userId) } },
      {
         $lookup: {
            from: "stories",
            localField: "stories",
            foreignField: "_id",
            as: "stories"
         }
      },
      { $sort: { createdAt: -1 } }
   ]);

    return res
      .status(200)
      .json(new ApiResponse(200, highlights, "User highlights fetched successfully"));
});

const renameHighlight = asyncHandler(async (req, res) => {
   const { highlightId } = req.params;
   const { newTitle } = req.body;
    if (!mongoose.Types.ObjectId.isValid(highlightId)) {
        throw new ApiError(400, "Invalid highlightId");
    }
    const highlight = await Highlight.findByIdAndUpdate(
        highlightId,
        { title: newTitle },
        { new: true }
    );
    if (!highlight) {
        throw new ApiError(404, "Highlight not found");
    }
    return res
      .status(200)
      .json(new ApiResponse(200, highlight, "Highlight renamed successfully"));
});

const deleteHighlight = asyncHandler(async (req, res) => {
   const { highlightId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(highlightId)) {
        throw new ApiError(400, "Invalid highlightId");
    }
    const highlight = await Highlight.findByIdAndDelete(highlightId);
    if (!highlight) {
        throw new ApiError(404, "Highlight not found");
    }
    return res
      .status(200)
      .json(new ApiResponse(200, null, "Highlight deleted successfully"));
});

export { createHighlight, addStoryToHighlight, removeStoryFromHighlight, getUserHighlights, renameHighlight, deleteHighlight };