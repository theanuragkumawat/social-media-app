import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken"

const verifyJWT = asyncHandler(async (req,res,next) => {

    try {
        
    

    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","")

    if(!token){
        throw new ApiError(401,"Unauthorized request")
    }

    const decodedToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)

    const user = await User.findById(decodedToken?._id).select("-password -refreshToken -emailVerificationToken -emailVerificationExpiry -forgotPasswordToken -forgotPasswordExpiry")

    if(!user){
        throw new ApiError(401,"Invalid access token")
    }

    req.user = user
    next()
    } catch (error) {
        // If the error is already an ApiError (thrown by us above), pass it through
        if (error instanceof ApiError) {
             throw error; 
        }
        
        // If it's a JWT specific error (expired, malformed), throw 401
        throw new ApiError(401, error?.message || "Invalid access token")
    }
})

export {verifyJWT}