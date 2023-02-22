import {NextFunction, Response} from "express";
import ApiError from "../exeptions/api-error";
import tokenService from "../service/token-service";
import {CustomRequest} from "../types/express/CustomRequest";

const authMiddleware = (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
        const authorization_header = req.headers.authorization;
        if (!authorization_header && typeof authorization_header !== 'string')
            return next(ApiError.UnauthorizedError());

        const access_token = authorization_header.split(" ")[1];
        if (!access_token) return next(ApiError.UnauthorizedError());

        const userData = tokenService.validateAccessToken(access_token);
        if (!userData) return next(ApiError.UnauthorizedError());

        req.user_id = userData.user_id;

        next();
    } catch (err: any) {
        return next(err);
    }
};

export default authMiddleware;