import express from "express";
import {MessageController} from "../controllers";
import {authMiddleware, filterMiddleware, limitMiddleware, sortMiddleware} from "../middlewares";

const router = express.Router();


router.get('/:id', authMiddleware, MessageController.getMessage);
router.get(
    '/dialog/:dialog_id',
    authMiddleware,
    filterMiddleware,
    sortMiddleware,
    limitMiddleware,
    MessageController.getByQuery
);
router.put('/check/:id', authMiddleware, MessageController.checkMessage);
router.post('/create', authMiddleware, MessageController.createMessage);
router.delete('/delete/:id', authMiddleware, MessageController.deleteMessage);

export default router;