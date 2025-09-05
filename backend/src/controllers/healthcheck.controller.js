import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiResponse } from "../utils/ApiResponse.js"

const healthcheck = asyncHandler(async (req,res) => {
    console.log("hey");
    
    return res.status(200).json(new ApiResponse(200,{status: "OK"},"All is well"))
})

export {
    healthcheck
}