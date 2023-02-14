import express from "express";
import {MessageController} from "../controllers";
import {authMiddleware} from "../middlewares";

const router = express.Router();


router.get('/all/:dialog_id', authMiddleware, MessageController.getMessages)
router.get('/id/:message_id', authMiddleware, MessageController.getMessage)
router.put('/check/:id', authMiddleware, MessageController.checkMessage)
router.post('/create', authMiddleware, MessageController.createMessage)
router.delete('/delete/:id', authMiddleware, MessageController.deleteMessage)

export default router