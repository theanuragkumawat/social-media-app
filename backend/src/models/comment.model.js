import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
   {
      text: {
         type: String,
         required: true,
         trim: true,
      },
      totalLikes: {
         type: Number,
         default: 0,
      },
      isEdited: {
         type: Boolean,
         default: false,
      },
      post: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Post",
         index:true
      },
      owner: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Post",
      },
   },
   { timestamps: true }
);

export const Comment = mongoose.model("Comment", commentSchema);
