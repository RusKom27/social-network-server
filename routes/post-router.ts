import express from "express";

import {PostController} from "../controllers";
import {authMiddleware} from "../middlewares";

const router = express.Router()

router.get('/', PostController.getByQuery)
router.get('/:post_id', PostController.getByPostId)
router.post('/create', authMiddleware, PostController.createPost)
router.put('/check/:id', authMiddleware, PostController.checkPost)
router.put('/like/:id', authMiddleware, PostController.likePost)
router.delete('/delete/:id', authMiddleware, PostController.deletePost)

export default router