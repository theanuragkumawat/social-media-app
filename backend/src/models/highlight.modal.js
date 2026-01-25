import mongoose from "mongoose";

const highlightSchema = new mongoose.Schema(
   {
      owner: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User",
         required: true,
         index: true,
      },
      title: {
         type: String,
         required: true,
         trim: true,
      },
      cover: {
         type: String, // thumbnail image
      },
      stories: [
         {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Story",
            required: true,
         },
      ],
   },
   { timestamps: true }
);

export const Highlight = mongoose.model("Highlight", highlightSchema);
