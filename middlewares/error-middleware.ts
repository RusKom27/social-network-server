import {NextFunction, Request, Response} from "express";
import ApiError from "../exeptions/api-error";

const errorMiddleware = (err: any, req: Request, res: Response, next: NextFunction) => {
    console.log(err);
    if (err instanceof ApiError) {
        return res.status(err.status).send({message: err.message, errors: err.errors});
    }
    return res.status(500).send("Server error");
};

export default errorMiddleware;