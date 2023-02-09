import express from "express";
import {MessageController} from "../controllers";
import {authMiddleware} from "../middlewares";

const router = express.Router();

router.get('/get/:dialog_id', authMiddleware, MessageController.getMessages)
router.put('/check/:id', authMiddleware, MessageController.checkMessage)
router.post('/create', authMiddleware, MessageController.createMessage)

export default router