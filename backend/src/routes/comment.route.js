import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { addComment, deleteComment, editComment, getComments } from "../controllers/comment.controller.js";

const router = Router()

router.use(verifyJWT)

router.route('/:postId/comments')
.post(addComment)
.get(getComments)

router.route('/:postId/comments/:commentId')
.patch(editComment)
.delete(deleteComment)

export default router