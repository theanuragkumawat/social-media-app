import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import crypto from "crypto";

const userSchema = new mongoose.Schema(
   {
      username: {
         type: String,
         required: true,
         unique: true,
         lowercase: true,
         trim: true,
         index: true,
      },
      email: {
         type: String,
         required: true,
         unique: true,
         lowercase: true,
         trim: true,
         index: true,
      },
      fullname: {
         type: String,
         required: true,
         trim: true,
         index: true,
      },
      avatar: {
         type: String,
      },
      dob: {
         type: Date,
      },
      bio: {
         type: String,
      },
      password: {
         type: String,
         required: [true, "Password is required"],
      },
      followersCount: {
         type: Number,
         default: 0,
      },
      followingCount: {
         type: Number,
         default: 0,
      },
      status: {
         type: String,
         enum: ["pending", "active"],
         default: "pending",
      },
      isPrivate: {
         type: Boolean,
         default: false,
      },
      isBlocked: {
         type: Boolean,
         default: false,
      },
      isDisabled: {
         type: Boolean,
         default: false,
      },
      isVerified: {
         type: Boolean,
         default: false,
      },
      refreshToken: {
         type: String,
      },
      forgotPasswordToken: {
         type: String,
      },
      forgotPasswordExpiry: {
         type: Date,
      },
      emailVerificationToken: {
         type: String,
      },
      emailVerificationExpiry: {
         type: Date,
      },
      otp: { type: String },
      otpExpiry: { type: Date },
   },
   { timestamps: true }
);

userSchema.pre("save", async function (next) {
   if (this.isModified("password")) {
      this.password = await bcrypt.hash(this.password, 10);
      next();
   } else {
      next();
   }
});

userSchema.methods.isPasswordCorrect = async function (password) {
   return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
   return jwt.sign(
      {
         _id: this._id,
         email: this.email,
         username: this.username,
         fullname: this.fullname,
      },
      process.env.ACCESS_TOKEN_SECRET,
      {
         expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
      }
   );
};

userSchema.methods.generateRefreshToken = function () {
   return jwt.sign(
      {
         _id: this._id,
      },
      process.env.REFRESH_TOKEN_SECRET,
      {
         expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
      }
   );
};

userSchema.methods.generateTemporaryToken = function () {
   const unhashedToken = crypto.randomBytes(20).toString("hex");

   const hashedToken = crypto
      .createHash("sha256") //algorithm
      .update(unhashedToken)
      .digest("hex");

   const tokenExpiry = Date.now() + 20 * 60 * 1000; // 20 mins

   return { hashedToken, unhashedToken, tokenExpiry };
};

userSchema.methods.generateOtp = function (){
   const otp = crypto.randomInt(100000, 1000000).toString()
   const otpExpiry = Date.now() + 20 * 60 * 1000 // 20 mins

   return {otp,otpExpiry}
}

export const User = mongoose.model("User", userSchema);
