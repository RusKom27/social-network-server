import express from "express";
import {AuthController} from "../controllers";
import {authMiddleware} from "../middlewares";

const router = express.Router()

router.post('/registration', AuthController.register)
router.post('/login', AuthController.login)
router.get('/refresh', AuthController.refresh)
router.post('/logout', AuthController.logout)

export default router