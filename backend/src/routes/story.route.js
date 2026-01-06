import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { createStory, deleteStory, getAllFeedStories, getUserStories, viewStory } from "../controllers/story.controller.js";

const router = Router()

router.use(verifyJWT)


router.route('/:userId/stories')
.get(getUserStories)

router.route('/:storyId')
.delete(deleteStory)

router.route('/:storyId/view').post(viewStory)

router.route('/')
.post(upload.single("media"),createStory)
.get(getAllFeedStories)

export default router