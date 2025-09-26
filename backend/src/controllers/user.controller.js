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
} from "../utils/mail.js";

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
      avatarLocalPath = req.file.path;
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
      new ApiResponse(
         200,
         createdUser,
         "User register successfully and verification email sent"
      )
   );
});

const loginUser = asyncHandler(async (req, res) => {
   const { email, password } = req.body;

   if ([email, password].some((field) => field.trim() === "")) {
      throw new ApiError(400, "All fields are required");
   }

   const user = await User.findOne({ email });

   if (!user) {
      throw new ApiError(404, "User does not exist");
   }

   const isPasswordValid = user.isPasswordCorrect(password);
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


const refreshAccessToken = asyncHandler(async (req, res) => {
   const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;
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

// const getCurrentUser = asyncHandler(async (req,res) => {

// })

export {
   registerUser,
   loginUser,
   logoutUser,
   getCurrentUser,
   verifyEmail,
   resendEmailVerification,
   refreshAccessToken,
   forgotPasswordRequest,
   resetForgotPassword,
   changeCurrentPassword,
};
