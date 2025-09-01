import mongoose from "mongoose";

const followSchema = new mongoose.Schema(
   {
      follower: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User",
         index:true
      },
      followee: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User",
         index:true
      },
   },
   { timestamps: true }
);

export const Follow = mongoose.model("Follow", followSchema);
