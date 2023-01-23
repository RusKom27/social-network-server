import express from "express";
import {MessageController} from "../controllers";

const router = express.Router();

router.get('/', MessageController.getAllMessages)
router.put('/check/:id', MessageController.checkMessage)
router.post('/', MessageController.createMessage)
router.post('/create_dialog', MessageController.createDialog)

export default router