import {NextFunction, Request, Response} from "express";
import {UserService} from "../service";
import {CustomRequest} from "../types/express/CustomRequest";

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
            return res.status(201).json(userData)
        } catch (err: any) {
            next(err)
        }
    }

    async login(req: Request, res: Response, next: NextFunction) {
        try {
            const {email, password} = req.body
            const userData = await UserService.loginUser(email, password)
            res.cookie('refresh_token', userData.refresh_token, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
            return res.status(201).send(userData)
        } catch (err: any) {
            next(err)
        }
    }

    async refresh(req: Request, res: Response, next: NextFunction) {
        try {
            const {refresh_token} = req.cookies
            const userData = await UserService.refresh(refresh_token)

            res.status(200).send(userData)
        } catch (err: any) {
            next(err)
        }
    }

    async logout(req: Request, res: Response, next: NextFunction) {
        try {
            const {refresh_token} = req.cookies
            const token = await UserService.logout(refresh_token)
            return res.clearCookie('refresh_token', {path: "/", domain: "localhost"}).json(token)
        } catch (err: any) {
            next(err)
        }
    }
}

export default new AuthController()