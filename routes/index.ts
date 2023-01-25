import authRouter from "./auth-router"
import imageRouter from "./image-router"
import messageRouter from "./message-router"
import postRouter from "./post-router"
import searchRouter from "./search-router"
import userRouter from "./user-router"
import express from "express";

const router = express.Router()

router.use('/api/auth', authRouter)
router.use('/api/user', userRouter)
router.use('/api/post', postRouter)
router.use('/api/message', messageRouter)
router.use('/api/image', imageRouter)
router.use('/api/search', searchRouter)

export default router