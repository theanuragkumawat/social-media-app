import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { addStoryToHighlight, createHighlight, deleteHighlight, getUserHighlights, removeStoryFromHighlight, renameHighlight } from "../controllers/highlight.controller.js";

const router = Router()

router.use(verifyJWT)

router.route('/').post(createHighlight)

router.route('/:userId/highlights').get(getUserHighlights)
router.route('/:highlightId/stories/:storyId').post(addStoryToHighlight)
router.route('/:highlightId/stories/:storyId').delete(removeStoryFromHighlight)
router.route('/:highlightId').patch(renameHighlight).delete(deleteHighlight)

export default router