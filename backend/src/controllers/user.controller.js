import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
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

export { 
   registerUser,
   loginUser
 };
