import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getUsersForSidebar, markMessageAsSeen, getMessages, sendMessage } from "../controllers/message.controller.js";

const router = Router()

router.route('/').get(verifyJWT,getUsersForSidebar)
router.route('/:userId').get(verifyJWT,getMessages)

router.route('/mark/:messageId').patch(verifyJWT, markMessageAsSeen)
router.route('/:userId/message').post(verifyJWT, sendMessage)


export default router