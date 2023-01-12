import {Request, Response, NextFunction} from "express";
import express from "express";
import User from "../models/User";

const router = express.Router()

router.get('/:login', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await User.findOne({login: req.params.login}).exec()
        if (!user) return res.status(404).send({message: "User not found"})
        if (user) res.status(200).send(user)
    } catch (err: any) {
        res.status(404).json({message: err.message})
    }
    next()
})

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await User.findById(req.headers.authorization).exec()
        if (!user) return res.status(404).send({message: "User not found"})
        res.send(user)
    } catch (err: any) {
        res.status(404).json({message: err.message})
    }
    next()
})

router.post('/update', async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findByIdAndUpdate(req.headers.authorization, req.body).exec()
        .catch(reason => {
            res.status(404).send({message: reason.message})
        })
    res.json(user)
    next()
})

router.put('/subscribe/:user_login', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const current_user = await User.findById(req.headers.authorization).exec()
        if (!current_user) return res.status(404).send({message: "User not found"})
        const user = await User.findOne({login: req.params.user_login}).exec()
        if (!user) return res.status(404).send({message: "User not found"})
        if (user.subscribers.indexOf(current_user._id) < 0) {
            user.subscribers.push(current_user._id)
            await user.save()
            res.status(200).json({
                ...user,
                subscribers: [
                    ...user.subscribers,
                    current_user._id]
            })
        } else {
            user.subscribers = user.subscribers.filter((user_id) => !user_id.equals(current_user._id))
            await user.save()
            res.json(user)
        }
    } catch (err: any) {
        res.status(404).json({message: err.message})
    }
    next()
})

export default router