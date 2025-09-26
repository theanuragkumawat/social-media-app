import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getAllPostLikes, likeComment, likePost, likeStory, unlikeComment, unlikePost, unlikeStory } from "../controllers/like.controller.js";

const router = Router()

router.use(verifyJWT)

router.route('/:postId/like')
.post(likePost)
.delete(unlikePost)
.get(getAllPostLikes)

router.route('/:commentId/like')
.post(likeComment)
.delete(unlikeComment)

router.route('/:storyId/like')
.post(likeStory)
.delete(unlikeStory)

export default router