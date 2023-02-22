import {CustomRequest} from "../types/express/CustomRequest";
import {NextFunction, Response} from "express";

const limitMiddleware = (req: CustomRequest, res: Response, next: NextFunction) => {
    const {query} = req;
    try {
        req.limit = typeof query.limit === "string" ? Number.parseInt(query.limit) : undefined;

        next();
    } catch (err: any) {
        next(err);
    }
};

export default limitMiddleware;