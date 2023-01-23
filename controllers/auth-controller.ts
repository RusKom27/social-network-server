import {NextFunction, Request, Response} from "express";
import {UserService} from "../service";
import bcrypt from "bcrypt";


class AuthController {
    async register(req: Request, res: Response, next: NextFunction) {
        try {
            const userData = await UserService.createUser(
                req.body.name,
                req.body.login,
                req.body.email,
                req.body.password,
            )
            res.cookie('refresh_token', userData.refresh_token, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
            return res.status(201).json(userData.user)
        } catch (err: any) {
            return res.status(400).json({message: err.message})
        }
    }

    async login (req: Request, res: Response, next: NextFunction) {
        try {
            const {email, password} = req.body
            const userData = UserService.loginUser(email, password)
        } catch (err: any) {
            return res.status(400).json({message: err.message})
        }
    }
}

export default new AuthController()