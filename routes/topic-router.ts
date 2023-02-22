import express from "express";
import TopicController from "../controllers/topic-controller";
import {filterMiddleware, limitMiddleware, sortMiddleware} from "../middlewares";

const router = express.Router();

router.get('/', filterMiddleware, sortMiddleware, limitMiddleware, TopicController.getByQuery);
router.get('/:topic_id', TopicController.getById);

export default router;