import mongoose, { Types } from "mongoose";

const storySchema = new mongoose.Schema(
   {
      owner: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User",
         required: true,
         index:true
      },
      mentions: [
         {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
         },
      ],
      recentViewers: [
         {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
         },
      ],
      media: {
         type: String,
         required: true,
      },
      status: {
         type: String,
         enum: ["public", "close_friends", "archive"],
         default: "public",
      },
      totalViews: {
         type: Number,
         default: 0,
      },
      totalLikes: {
         type: Number,
         default: 0,
      },
   },
   { timestamps: true }
);

export const Story = mongoose.model("Story", storySchema);
