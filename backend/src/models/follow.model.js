import mongoose from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

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

followSchema.plugin(mongooseAggregatePaginate)

export const Follow = mongoose.model("Follow", followSchema);
