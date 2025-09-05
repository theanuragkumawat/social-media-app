import { validationResult } from "express-validator";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import fs from "fs"

const validate = (req, res, next) => {
   // console.log(req.body);
   
   const errors = validationResult(req);
   if (errors.isEmpty()) {
      return next();
   }

   const extractedErrors = [];
   errors.array().map((error) =>
      extractedErrors.push({
         [error.path]: error.msg,
      })
   );

    if (req.file?.path) {
      fs.unlinkSync(req.file.path)
   }
//    throw new ApiError(422,"Received data is not valid",extractedErrors)
return res.status(422).json(new ApiResponse(422,extractedErrors,"Received data is not valid"))
};

export { validate };
