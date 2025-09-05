import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { loginUser, registerUser } from "../controllers/user.controller.js";
import { userRegisterValidator } from "../validators/index.js";
import { validate } from "../middlewares/validator.middleware.js";
const router = Router();

router.route("/register").post( 
   upload.single("avatar"),
   userRegisterValidator(),validate,
   registerUser
   //register controller
);

router.route("/login").post(loginUser)

export default router;
