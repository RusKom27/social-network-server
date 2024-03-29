import authRouter from "./auth-router";
import imageRouter from "./image-router";
import messageRouter from "./message-router";
import postRouter from "./post-router";
import userRouter from "./user-router";
import dialogRouter from "./dialog-router";
import topicRouter from "./topic-router";
import express from "express";

const router = express.Router();

router.use('/api/auth', authRouter);
router.use('/api/user', userRouter);
router.use('/api/post', postRouter);
router.use('/api/message', messageRouter);
router.use('/api/dialog', dialogRouter);
router.use('/api/image', imageRouter);
router.use('/api/topic', topicRouter);

export default router;