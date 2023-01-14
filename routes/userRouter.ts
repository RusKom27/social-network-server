import {Request, Response, NextFunction} from "express";
import express from "express";

import {UserController} from "../controllers";
import {checkToken} from "../helpers/validation";
import {addChannel, removeChannel, sendMessage} from "../packages/ably";

const router = express.Router()

router.get('/:login', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await UserController.getUserByFilter({login: req.params.login})
        res.status(200).send(user)
    } catch (err: any) {
        res.status(404).json({message: err.message})
    }
})

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = checkToken(req.headers.authorization);
        const user = await UserController.getUserById(token)
        addChannel(user._id)
        res.status(202).send(user)
    } catch (err: any) {
        res.status(404).json({message: err.message})
    }
})

router.delete('/close_connection', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = checkToken(req.headers.authorization);
        const user = await UserController.getUserById(token)
        console.log(user._id)
        removeChannel(user._id)
        res.status(202).send(user)
    } catch (err: any) {
        res.status(404).json({message: err.message})
    }
})

router.post('/update', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = checkToken(req.headers.authorization);
        const user = await UserController.getUserByIdAndUpdate(token, req.body)
        res.json(user)
    } catch (err: any) {
        res.status(404).json({message: err.message})
    }
})

router.put('/subscribe/:user_login', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = checkToken(req.headers.authorization);
        const current_user = await UserController.getUserById(token)
        const user = await UserController.getUserByFilter({login: req.params.user_login})
        if (user.subscribers.map(subscriber => subscriber.toString()).indexOf(current_user._id.toString()) < 0) {
            const changed_user = await UserController.getUserByIdAndUpdate(
                user._id,
                {subscribers: [...user.subscribers, current_user._id]}
            )
            sendMessage(
                "user_subscribed",
                current_user,
                [user._id]
            )
            res.status(200).json(changed_user)
        } else {
            const changed_user = await UserController.getUserByIdAndUpdate(
                user._id,
                {subscribers: user.subscribers.filter((user_id) => !user_id.equals(current_user._id))}
            )
            sendMessage(
                "user_unsubscribed",
                current_user,
                [user._id]
            )
            res.status(200).json(changed_user)
        }
    } catch (err: any) {
        res.status(404).json({message: err.message})
    }
})

export default router