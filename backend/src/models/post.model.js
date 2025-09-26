import mongoose from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2"

const postSchema = new mongoose.Schema(
  {
    caption: {
      type: String,
      required: true,
      trim: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    media: [
      {
        type: String,
        required:true
      },
    ],
    totalLikes: {
      type: Number,
      default: 0,
    },
    totalComments: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["public", "archive"],
      default: "public",
    },
    mentions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    location: {
      type: String,
    },
  },
  { timestamps: true }
);

postSchema.plugin(mongooseAggregatePaginate)

export const Post = mongoose.model("Post", postSchema);
