import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { changeCurrentPassword, forgotPasswordRequest, getCurrentUser, loginUser, logoutUser, refreshAccessToken, registerUser, resendEmailVerification, resetForgotPassword, verifyEmail } from "../controllers/user.controller.js";
import { getAllUserPosts } from "../controllers/post.controller.js";
import {
   userChangeCurrentPasswordValidator,
   userForgotPasswordValidator,
   userLoginValidator,
   userRegisterValidator,
   userResetForgotPasswordValidator,
} from "../validators/index.js";
import { validate } from "../middlewares/validator.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
const router = Router();

// unsecured
router.route("/register").post(
   upload.single("avatar"),
   userRegisterValidator(),
   validate,
   registerUser //register controller
);

router.route("/login").post(userLoginValidator(), validate, loginUser);
router.route("/verify-email/:verificationToken").get(verifyEmail)
router.route("/refresh-token").post(refreshAccessToken)
router.route("/forgot-password").post(userForgotPasswordValidator(),validate, forgotPasswordRequest)
router.route("/reset-password/:unHashedToken").post(userResetForgotPasswordValidator(),validate, resetForgotPassword)

//secured
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/current-user").post(verifyJWT, getCurrentUser);
router.route("/change-password").post(verifyJWT, userChangeCurrentPasswordValidator(),validate, changeCurrentPassword);
router.route("/resend-email-verification").post(verifyJWT,resendEmailVerification)

//posts
// router.route("/:userId/posts").get(getAllUserPosts)
export default router;
