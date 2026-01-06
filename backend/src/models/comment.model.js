import mongoose from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

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
         ref: "User",
      },
      parent: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Comment",
         default: null
      }
   },
   { timestamps: true }
);

commentSchema.plugin(mongooseAggregatePaginate)

export const Comment = mongoose.model("Comment", commentSchema);
