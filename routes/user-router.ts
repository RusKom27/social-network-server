import express from "express";
import UserController from "../controllers/user-controller";
import {authMiddleware, filterMiddleware, limitMiddleware, sortMiddleware} from "../middlewares";

const router = express.Router();

router.get('/', filterMiddleware, sortMiddleware, limitMiddleware, UserController.getByQuery);
router.get('/:id', UserController.getById);
router.post('/create', UserController.createUser);
router.post('/update', authMiddleware, UserController.updateUser);
router.put('/subscribe/:user_id', authMiddleware, UserController.subscribeUser);

export default router;