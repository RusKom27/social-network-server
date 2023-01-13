import {NextFunction, Request, Response} from "express";
import express from "express";
import {UserController} from "../controllers";

const router = express.Router()

router.post('/register', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await UserController.createUser(
            req.body.name,
            req.body.login,
            req.body.email,
            req.body.password,
        )
        res.status(201).json(user)
    } catch (err: any) {
        res.status(400).json({message: err.message})
    }
})

router.post('/login', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await UserController.getUserByFilter({
            email: req.body.email,
            password: req.body.password}
        )
        res.status(200).send(user)
    } catch (err: any) {
        res.status(400).json({message: err.message})
    }
})

export default router