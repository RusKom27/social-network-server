import {NextFunction, Request, Response} from "express";
import {getToken, getUserId} from "../helpers/validation";
import {UserService} from "../service";
import {CustomRequest} from "../types/express/CustomRequest";
import {Types} from "mongoose";


class UserController {
    async getByQuery (req: CustomRequest, res: Response, next: NextFunction) {
        try {
            const users = await UserService.getUsersByFilter(req.filter, req.sort?.user, req.limit);
            return res.status(200).send(users.map(user => user._id))

        } catch (err: any) {
            next(err)
        }
    }

    async getById (req: Request, res: Response, next: NextFunction) {
        try {
            const user = await UserService.getUserById(req.params.id)
            return res.status(200).send(user)
        } catch (err: any) {
            next(err)
        }
    }

    async getByIdArray (req: Request, res: Response, next: NextFunction) {
        try {
            if (!req.query.users_id) return res.status(404).send({message: "Users query is empty"})
            const users = await UserService.getUsersById(req.query.users_id as string[])
            return res.status(200).send(users)
        } catch (err: any) {
            next(err)
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
            next(err)
        }
    }

    async updateUser (req: Request, res: Response, next: NextFunction) {
        try {
            const token = getToken(req.headers.authorization);
            const user = await UserService.getUserByIdAndUpdate(token, req.body)
            return res.status(200).json(user)
        } catch (err: any) {
            next(err)
        }
    }

    async subscribeUser (req: CustomRequest, res: Response, next: NextFunction) {
        try {
            const user_id = getUserId(req.user_id);
            const current_user = await UserService.getUserById(user_id)
            const user = await UserService.getUserById(req.params.user_id)
            let subscribers: Types.ObjectId[]
            if (user.subscribers.map(subscriber => subscriber.toString()).indexOf(current_user._id.toString()) < 0)
                subscribers = [...user.subscribers, current_user._id]
            else
                subscribers = user.subscribers.filter((user_id) => !user_id.equals(current_user._id))

            const changed_user = await UserService.getUserByIdAndUpdate(
                user._id,
                {subscribers, subscribersCount: subscribers.length}
            )

            return res.status(200).json(changed_user)
        } catch (err: any) {
            next(err)
        }
    }
}

export default new UserController()
