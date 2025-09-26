import {Router} from "express"
import { deletePost, getAllUserPosts, getPostById, togglePostStatus, updatePost, uploadPost } from "../controllers/post.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"
import { upload } from "../middlewares/multer.middleware.js"
import { uploadPostValidator } from "../validators/index.js"
import { validate } from "../middlewares/validator.middleware.js"

const router = Router()

router.use(verifyJWT)

router.route('/')
.post(upload.array("media",10),uploadPostValidator(),validate, uploadPost)

router.route('/:postId')
.get(getPostById)
.patch(updatePost)
.delete(deletePost)

router.route('/:postId/status').patch(togglePostStatus)
router.route('/:userId/posts').get(getAllUserPosts)
export default router