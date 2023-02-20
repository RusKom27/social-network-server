import express from "express";
import {SearchController} from "../controllers";
import TopicController from "../controllers/topic-controller";

const router = express.Router()

router.get('/', TopicController.getByQuery);
router.get('/:topic_id', TopicController.getById);

export default router