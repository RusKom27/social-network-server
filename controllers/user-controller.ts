import {NextFunction, Request, Response} from "express";
import {checkToken} from "../helpers/validation";
import {addChannel, removeChannel, sendMessage} from "../packages/ably";
import {UserService} from "../service";

class UserController {
    async getByToken (req: Request, res: Response, next: NextFunction) {
        try {
            const token = checkToken(req.headers.authorization);
            const user = await UserService.getUserById(token)
            addChannel(user._id)
            return res.status(202).send(user)
        } catch (err: any) {
            return res.status(404).json({message: err.message})
        }
    }

    async getByLogin (req: Request, res: Response, next: NextFunction) {
        try {
            const user = await UserService.getUserByFilter({login: req.params.login})
            return res.status(200).send(user)
        } catch (err: any) {
            return res.status(404).json({message: err.message})
        }
    }

    async getById (req: Request, res: Response, next: NextFunction) {
        try {
            const user = await UserService.getUserById(req.params.id)
            return res.status(200).send(user)
        } catch (err: any) {
            return res.status(404).json({message: err.message})
        }
    }

    async getByIdArray (req: Request, res: Response, next: NextFunction) {
        try {
            if (!req.query.users_id) return res.status(404).send({message: "Users query is empty"})
            const users = await UserService.getUsersById(req.query.users_id as string[])
            return res.status(200).send(users)
        } catch (err: any) {
            return res.status(404).json({message: err.message})
        }
    }

    async createUser (req: Request, res: Response, next: NextFunction) {
        try {
            const user = await UserService.createUser(
                req.body.name,
                req.body.login,
                req.body.email,
                req.body.password,
            )
            return res.status(201).json(user)
        } catch (err: any) {
            return res.status(400).json({message: err.message})
        }
    }

    async login (req: Request, res: Response, next: NextFunction) {
        try {
            const user = await UserService.getUserByFilter({
                email: req.body.email,
                password: req.body.password}
            )
            return res.status(200).send(user)
        } catch (err: any) {
            res.status(400).json({message: err.message})
        }
    }

    async closeConnection (req: Request, res: Response, next: NextFunction) {
        try {
            const token = checkToken(req.headers.authorization);
            const user = await UserService.getUserById(token)
            console.log(user._id)
            removeChannel(user._id)
            return res.status(202).send(user)
        } catch (err: any) {
            return res.status(404).json({message: err.message})
        }
    }

    async updateUser (req: Request, res: Response, next: NextFunction) {
        try {
            const token = checkToken(req.headers.authorization);
            const user = await UserService.getUserByIdAndUpdate(token, req.body)
            return res.json(user)
        } catch (err: any) {
            return res.status(404).json({message: err.message})
        }
    }

    async subscribeUser (req: Request, res: Response, next: NextFunction) {
        try {
            const token = checkToken(req.headers.authorization);
            const current_user = await UserService.getUserById(token)
            const user = await UserService.getUserByFilter({login: req.params.user_login})
            if (user.subscribers.map(subscriber => subscriber.toString()).indexOf(current_user._id.toString()) < 0) {
                const changed_user = await UserService.getUserByIdAndUpdate(
                    user._id,
                    {subscribers: [...user.subscribers, current_user._id]}
                )
                sendMessage(
                    "user_subscribed",
                    current_user,
                    [user._id]
                )
                return res.status(200).json(changed_user)
            } else {
                const changed_user = await UserService.getUserByIdAndUpdate(
                    user._id,
                    {subscribers: user.subscribers.filter((user_id) => !user_id.equals(current_user._id))}
                )
                sendMessage(
                    "user_unsubscribed",
                    current_user,
                    [user._id]
                )
                return res.status(200).json(changed_user)
            }
        } catch (err: any) {
            return res.status(404).json({message: err.message})
        }
    }
}

export default new UserController()
