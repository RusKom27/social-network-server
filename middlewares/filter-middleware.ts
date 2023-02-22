import {CustomRequest} from "../types/express/CustomRequest";
import {NextFunction, Response} from "express";
import {UserService} from "../service";

const filterMiddleware = async (req: CustomRequest, res: Response, next: NextFunction) => {
    const {query} = req;

    try {
        const filter: any = {};
        if (typeof query.login === "string") filter.login = new RegExp(query.login, "i");
        if (typeof query.name === "string") filter.name = new RegExp(query.name, "i");

        if (typeof query.author_id === "string") filter.author_id = query.author_id;
        if (typeof query.text === "string") filter.text = new RegExp(`${query.text}`, "g");
        if (typeof query.likes === "string") filter.likes = {"$all": [query.likes]};
        if (typeof query.follows === "string") {
            const followed_users = await UserService.getUsersByUserFollows(query.follows);
            filter.author_id = {"$in": followed_users.map(user => user._id.toString())};
        }

        req.filter = filter;
        next();
    } catch (err: any) {
        next(err);
    }
};

export default filterMiddleware;