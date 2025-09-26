import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getFollowers, getFollowing, removeFollower, toggleFollow } from "../controllers/follow.controller.js";

const router = Router()

router.use(verifyJWT)

router.route('/:userId/follow')
.post(toggleFollow)
.delete(removeFollower)

router.route('/:userId/followers').get(getFollowers)
router.route('/:userId/following').get(getFollowing)

export default router