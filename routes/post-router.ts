import express from "express";

import {PostController} from "../controllers";
import {authMiddleware} from "../middlewares";

const router = express.Router()

router.get('/all', PostController.getAll)
router.get('/user_login/:user_login', PostController.getByUserLogin)
router.get('/id/:post_id', PostController.getByPostId)
router.get('/popular_tags', PostController.getPopularTags)
router.get('/actual_topics', PostController.getActualTopics)
router.post('/create', authMiddleware, PostController.createPost)
router.put('/check/:id', authMiddleware, PostController.checkPost)
router.put('/like/:id', authMiddleware, PostController.likePost)
router.delete('/delete/:id', authMiddleware, PostController.deletePost)

export default router