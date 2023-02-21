import {CustomRequest} from "../types/express/CustomRequest";
import {NextFunction, Response} from "express";
import {OrderBy, Sort} from "../types";

const filterMiddleware = (req: CustomRequest, res: Response, next: NextFunction) => {
    const {query} = req

    try {
        const sort: Sort = {user: [], post: [], topic: []}
        if (typeof query.sort_by_popularity === "string") {
            sort.user?.push(["subscribersCount", query.sort_by_popularity as OrderBy])
            sort.post?.push(["likesCount", query.sort_by_popularity as OrderBy])
            sort.topic?.push(["count", query.sort_by_popularity as OrderBy])
        }
        if (typeof query.sort_by_relevance === "string") {
            sort.post?.push(["creation_date", query.sort_by_relevance as OrderBy])
        }

        req.sort = sort

        next()
    } catch (err: any) {
        next(err)
    }
}

export default filterMiddleware