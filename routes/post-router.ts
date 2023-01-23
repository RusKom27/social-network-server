import express from "express";

import {PostController} from "../controllers";

const router = express.Router()

router.get('/all', PostController.getAll)
router.get('/user_login/:user_login', PostController.getByUserLogin)
router.get('/id/:post_id', PostController.getByPostId)
router.get('/popular_tags', PostController.getPopularTags)
router.get('/actual_topics', PostController.getActualTopics)
router.post('/create', PostController.createPost)
router.put('/check/:id', PostController.checkPost)
router.put('/like/:id', PostController.likePost)
router.delete('/delete/:id', PostController.deletePost)

export default router