import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import {
   sendEmail,
   emailVerificationMailgenContent,
   forgotPasswordMailgenContent,
   emailOtpVerificationMailgenContent,
} from "../utils/mail.js";
import { Follow } from "../models/follow.model.js";

const generateAccessAndRefreshTokens = async (userId) => {
   try {
      const user = await User.findById(userId);
      const accessToken = user.generateAccessToken();
      const refreshToken = user.generateRefreshToken();
      user.refreshToken = refreshToken;
      await user.save({ validateBeforeSave: false });
      return { accessToken, refreshToken };
   } catch (error) {
      throw new ApiError(
         500,
         "Something went wrong while generating Access and Refresh Token"
      );
   }
};

const registerUser = asyncHandler(async (req, res) => {
   const { email, username, fullname, password } = req.body;
   // console.log(req.body);
   

   if (
      [email, username, fullname, password].some(
         (field) => field?.trim() === ""
      )
   ) {
      throw new ApiError(400, "All fields are required");
   }

   const existingEmail = await User.findOne({ email: email });
   if (existingEmail) {
      throw new ApiError(400, "User with this email already exists");
   }

   const existingUsername = await User.findOne({ username: username });
   if (existingUsername) {
      throw new ApiError(400, "This username is not available");
   }

   let avatarLocalPath;
   if (req.file?.path) {
      avatarLocalPath = req.file?.path;
   }
   // console.log(avatarLocalPath);

   let avatar;
   if (avatarLocalPath) {
      avatar = await uploadOnCloudinary(avatarLocalPath);
   }

   const user = await User.create({
      username: username.toLowerCase(),
      email,
      fullname: fullname.trim(),
      avatar: avatar?.url || "",
      password,
   });

   // const { hashedToken, unhashedToken, tokenExpiry } =
   //    user.generateTemporaryToken();

   // user.emailVerificationToken = hashedToken;
   // user.emailVerificationExpiry = tokenExpiry;

   // await user.save({ validateBeforeSave: false });

   // await sendEmail({
   //    email: user.email,
   //    subject: "Please verify your email",
   //    mailgenContent: emailVerificationMailgenContent(
   //       user.username,
   //       `${req.protocol}://${req.get("host")}/api/v1/users/verify-email/${unhashedToken}`
   //    ),
   // });

   const createdUser = await User.findById(user._id).select(
      "-password -refreshToken -emailVerificationToken -emailVerificationExpiry -forgotPasswordToken -forgotPasswordExpiry"
   );

   if (!createdUser) {
      throw new ApiError(
         500,
         "Something went wrong while registering the user"
      );
   }

   res.status(200).json(
      new ApiResponse(200, createdUser, "User register successfully")
   );
});

const dobRegisterUser = asyncHandler(async (req, res) => {
   const { userId } = req.params;
   const { dob } = req.body;
   const dobIso = new Date(dob);
   const user = await User.findById(userId);

   if (!user) {
      throw new ApiError(500, "Something went wrong while updating dob");
   }

   const { otp, otpExpiry } = user.generateOtp();

   user.dob = dob;
   user.otp = otp;
   user.otpExpiry = otpExpiry;

   await user.save({ validateBeforeSave: false });

   await sendEmail({
      email: user.email,
      subject: "Please verify your email",
      mailgenContent: emailOtpVerificationMailgenContent(user.username, otp),
   });

   return res
      .status(200)
      .json(
         new ApiResponse(200, user, "Dob updated and OTP sent successfully")
      );
});

const loginUser = asyncHandler(async (req, res) => {
   const { email, password } = req.body;

   if ([email, password].some((field) => field.trim() === "")) {
      throw new ApiError(400, "All fields are required");
   }

   const user = await User.findOne({ email: email });

   if (!user) {
      throw new ApiError(404, "User does not exist");
   }

   const isPasswordValid = await user.isPasswordCorrect(password);
   console.log(isPasswordValid);

   if (!isPasswordValid) {
      throw new ApiError(404, "Invalid user credentials");
   }

   const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
      user._id
   );

   const loggedInUser = await User.findById(user._id).select(
      "-password -refreshToken -emailVerificationToken -emailVerificationExpiry -forgotPasswordToken -forgotPasswordExpiry"
   );

   const options = {
      httpOnly: true,
      secure: true,
   };

   return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
         new ApiResponse(
            200,
            { user: loggedInUser, accessToken, refreshToken },
            "User logged in successfully"
         )
      );
});

const logoutUser = asyncHandler(async (req, res) => {
   await User.findByIdAndUpdate(
      req.user._id,
      {
         $set: {
            refreshToken: "",
         },
      },
      { new: true }
   );

   const options = {
      httpOnly: true,
      secure: true,
   };

   return res
      .status(200)
      .clearCookie("accessToken", options)
      .clearCookie("refreshToken", options)
      .json(new ApiResponse(200, {}, "User logged out successfully"));
});

const getCurrentUser = asyncHandler(async (req, res) => {
   return res
      .status(200)
      .json(
         new ApiResponse(200, req.user, "Current user fetched successfully")
      );
});

const resendEmailVerification = asyncHandler(async (req, res) => {
   const user = await User.findById(req.user?._id);

   if (!user) {
      throw new ApiError(404, "User does not exist");
   }

   if (user.isVerified) {
      throw new ApiError(409, "User already verified");
   }

   const { hashedToken, unhashedToken, tokenExpiry } =
      user.generateTemporaryToken();

   user.emailVerificationToken = hashedToken;
   user.emailVerificationExpiry = tokenExpiry;

   await user.save({ validateBeforeSave: false });

   await sendEmail({
      email: user.email,
      subject: "Please verify your email",
      mailgenContent: emailVerificationMailgenContent(
         user.username,
         `${req.protocol}://${req.get("host")}/api/v1/users/verify-email/${unhashedToken}`
      ),
   });

   return res
      .status(200)
      .json(new ApiResponse(200, {}, "Verification mail has been sent"));
});

const verifyEmail = asyncHandler(async (req, res) => {
   const { verificationToken } = req.params;

   if (!verificationToken) {
      throw new ApiError(400, "Email verification token is missing");
   }

   const hashedToken = crypto
      .createHash("sha256")
      .update(verificationToken)
      .digest("hex");

   const user = await User.findOne({
      emailVerificationToken: hashedToken,
      emailVerificationExpiry: { $gt: Date.now() },
   });

   if (!user) {
      throw new ApiError(400, "Token is invalid or expired");
   }

   user.isVerified = true;
   user.emailVerificationExpiry = undefined;
   user.emailVerificationToken = undefined;
   await user.save({ validateBeforeSave: false });

   return res
      .status(200)
      .json(
         new ApiResponse(
            200,
            { isEmailVerified: true },
            "Email verified successfully"
         )
      );
});

const verifyOtp = asyncHandler(async (req, res) => {
   const { otp } = req.body;

   if (!otp) {
      throw new ApiError(400, "OTP is required");
   }

   const user = await User.findOne({
      otp: otp,
      otpExpiry: { $gt: Date.now() },
   });

   if (!user) {
      throw new ApiError(400, "OTP is invalid or expired");
   }

   user.isVerified = true;
   user.otp = undefined;
   user.otpExpiry = undefined;
   await user.save({ validateBeforeSave: false });

   return res
      .status(200)
      .json(new ApiResponse(200, user, "OTP verified successfully"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
   console.log("refreshToken ran");

   const incomingRefreshToken =
      req.cookies.refreshToken || req.body.refreshToken;
   if (!incomingRefreshToken) {
      throw new ApiError(401, "Unauthorized request ");
   }

   const decodedRefreshToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
   );

   const user = await User.findById(decodedRefreshToken?._id).select(
      "-password -refreshToken -emailVerificationToken -emailVerificationExpiry -forgotPasswordToken -forgotPasswordExpiry"
   );

   if (!user) {
      throw new ApiError(401, "Invalid refreshToken ");
   }

   const options = {
      httpOnly: true,
      secure: true,
   };

   const { accessToken, refreshToken: newRefreshToken } =
      await generateAccessAndRefreshTokens(user._id);

   return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
         new ApiResponse(200, {
            user: user,
            accessToken,
            refreshToken: newRefreshToken,
         })
      );
});

const forgotPasswordRequest = asyncHandler(async (req, res) => {
   const { email } = req.body;

   const user = await User.findOne({ email });

   if (!user) {
      throw new ApiError(404, "User does not exist");
   }

   const { hashedToken, unhashedToken, tokenExpiry } =
      user.generateTemporaryToken();

   user.forgotPasswordToken = hashedToken;
   user.forgotPasswordExpiry = tokenExpiry;

   await user.save({ validateBeforeSave: false });

   await sendEmail({
      email: user.email,
      subject: "Password reset request",
      mailgenContent: forgotPasswordMailgenContent(
         user.username,
         `${process.env.FORGOT_PASSWORD_REDIRECT_URL}/${unhashedToken}`
      ),
   });

   return res
      .status(200)
      .json(
         new ApiResponse(200, {}, "Forgot password email sent successfully")
      );
});

const resetForgotPassword = asyncHandler(async (req, res) => {
   const { unHashedToken } = req.params;
   const { newPassword } = req.body;

   let hashedToken = crypto
      .createHash("sha256")
      .update(unHashedToken)
      .digest("hex");

   const user = await User.findOne({
      forgotPasswordToken: hashedToken,
      forgotPasswordExpiry: { $gt: Date.now() },
   });

   if (!user) {
      throw new ApiError(489, "Token is invalid or expired");
   }

   user.forgotPasswordExpiry = undefined;
   user.forgotPasswordToken = undefined;
   user.password = newPassword;
   await user.save({ validateBeforeSave: false });

   return res
      .status(200)
      .json(new ApiResponse(200, {}, "Password reset successfully"));
});

const changeCurrentPassword = asyncHandler(async (req, res) => {
   const { oldPassword, newPassword } = req.body;

   const user = await User.findById(req.user?._id);

   const isPasswordValid = await user.isPasswordCorrect(oldPassword);
   if (!isPasswordValid) {
      throw new ApiError(400, "Invalid old password");
   }

   user.password = newPassword;
   await user.save({ validateBeforeSave: false });

   return res
      .status(200)
      .json(new ApiResponse(200, {}, "Password changed successfully"));
});

const changeAvatar = asyncHandler(async (req, res) => {
   const avatarLocalPath = req.file?.path;

   if (!avatarLocalPath) {
      throw new ApiError(400, "Avatar file is missing");
   }

   const avatar = await uploadOnCloudinary(avatarLocalPath);
   if (!avatar.url) {
      throw new ApiError(400, "Error while uploading on cloudinary");
   }

   const user = await User.findByIdAndUpdate(
      req.user?._id,
      {
         $set: {
            avatar: avatar.url,
         },
      },
      { new: true }
   ).select(
      "-password -refreshToken -emailVerificationToken -emailVerificationExpiry -forgotPasswordToken -forgotPasswordExpiry"
   );

   return res
      .status(200)
      .json(new ApiResponse(200, user, "avatar image updated successfully"));
});

const removeAvatar = asyncHandler(async (req, res) => {
   const user = await User.findByIdAndUpdate(
      req.user?._id,
      {
         $set: {
            avatar: "",
         },
      },
      { new: true }
   ).select(
      "-password -refreshToken -emailVerificationToken -emailVerificationExpiry -forgotPasswordToken -forgotPasswordExpiry"
   );

   return res
      .status(200)
      .json(new ApiResponse(200, user, "avatar image removed successfully"));
});

const getUserProfile = asyncHandler(async (req, res) => {
   // const userId = req.user?._id;
   const { username } = req.params;
   // console.log(req.params);

   const user = await User.findOne({ username: username });

   if (!user) {
      throw new ApiError(404, "User not found");
   }

   const isFollowing = await Follow.exists({
      follower: req.user?._id,
      followee: user._id,
   });

   const isFollowedBy = await Follow.exists({
      follower: user._id,
      followee: req.user?._id
   })


   return res
      .status(200)
      .json(new ApiResponse(200, {...user.toObject(), isFollowing: !!isFollowing, isFollowedBy: !!isFollowedBy }, "User profile fetched successfully"));
});

const changeProfileDetails = asyncHandler(async (req, res) => {
   const { bio, website, gender } = req.body;

   const userId = req.user?._id;

   const user = await User.findByIdAndUpdate(
      userId,
      {
         $set: {
            website: website,
            bio: bio,
            gender: gender,
         },
      },
      { new: true }
   ).select(
      "-password -refreshToken -emailVerificationToken -emailVerificationExpiry -forgotPasswordToken -forgotPasswordExpiry"
   );

   if (!user) {
      throw new ApiError(500, "Something went wrong while updating profile");
   }

   return res
      .status(200)
      .json(new ApiResponse(200, user, "Profile updated successfully"));
});

const searchUsers = asyncHandler(async (req, res) => {
   console.log(req.query);

   const { search, page = 1, limit = 10 } = req.query;
   const pageNumber = parseInt(page);
   const limitNumber = parseInt(limit);

   if (!search || String(search).trim() == "") {
      return res
         .status(200)
         .json(new ApiResponse(400, [], "Search query is required"));
   }

   const safeSearch = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

   const usersAggregate = User.aggregate([
      {
         $match: {
            $or: [
               { username: { $regex: safeSearch, $options: "i" } },
               { fullname: { $regex: safeSearch, $options: "i" } },
            ],
         },
      },
      {
         $project: {
            username: 1,
            fullname: 1,
            avatar: 1,
         },
      },
   ]);

   const users = await User.aggregatePaginate(usersAggregate, {
      page: pageNumber,
      limit: limitNumber,
   });

   if (!users) {
      throw new ApiError(500, "Something went wrong while searching users");
   }

   return res
      .status(200)
      .json(new ApiResponse(200, users, "Users fetched successfully"));
});

const getUserProfileById = asyncHandler(async (req, res) => {
   const { userId } = req.params;

   if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new ApiError(400, "Invalid user id");
   }
});

// const getCurrentUser = asyncHandler(async (req,res) => {

// })

export {
   registerUser,
   dobRegisterUser,
   loginUser,
   logoutUser,
   getCurrentUser,
   verifyEmail,
   verifyOtp,
   resendEmailVerification,
   refreshAccessToken,
   forgotPasswordRequest,
   resetForgotPassword,
   changeCurrentPassword,
   changeAvatar,
   removeAvatar,
   getUserProfile,
   changeProfileDetails,
   searchUsers,
};
