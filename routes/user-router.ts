import express from "express";
import UserController from "../controllers/user-controller";
import {authMiddleware} from "../middlewares";

const router = express.Router()

router.get('/login/:login', UserController.getByLogin)
router.get('/id/:id', UserController.getById)
router.get('/id_array', UserController.getByIdArray)
router.post('/create', UserController.createUser)
router.post('/login', UserController.login)
router.post('/update', authMiddleware, UserController.updateUser)
router.put('/subscribe/:user_id', authMiddleware, UserController.subscribeUser)

export default router