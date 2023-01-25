import {NextFunction, Request, Response} from "express";
import ApiError from "../exeptions/api-error";
import tokenService from "../service/token-service";
import {CustomRequest} from "../types/express/CustomRequest";

const authMiddleware = (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
        const authorization_header = req.headers.authorization
        if (!authorization_header) return next(ApiError.UnauthorizedError())

        const access_token = authorization_header.split(" ")[1]
        if (!access_token) return next(ApiError.UnauthorizedError())

        const userData = tokenService.validateAccessToken(access_token)
        if (!userData) return next(ApiError.UnauthorizedError())

        req.user = userData

        next()
    } catch (err: any) {
        return next(err)
    }
}

export default authMiddleware