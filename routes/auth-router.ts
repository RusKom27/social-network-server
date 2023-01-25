import express from "express";
import {AuthController} from "../controllers";

const router = express.Router()

router.post('/register', AuthController.register)
router.post('/login', AuthController.login)
router.post('/logout', AuthController.logout)

export default router