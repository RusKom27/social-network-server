import {NextFunction, Request, Response} from "express";
import express from "express";
import User from "../models/User";

const router = express.Router()

router.post('/register', async (req: Request, res: Response, next: NextFunction) => {
    const user = new User({
        name: req.body.name,
        login: req.body.login,
        email: req.body.email,
        password: req.body.password,
    })
    try {
        const newUser = await user.save()
        res.status(201).json(newUser)
    } catch (err: any) {
        res.status(400).json({message: err.message})
    }
})

router.post('/login', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await User.findOne({email: req.body.email, password: req.body.password}).exec()
        if (!user) return res.status(404).send({message: "User not found"})
        res.json(user)
    } catch (err: any) {
        res.status(400).json({message: err.message})
    }
})

export default router