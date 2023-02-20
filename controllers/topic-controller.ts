import {NextFunction, Request, Response} from "express";
import {isEmpty} from "../helpers/misc";
import {PostService, TopicService} from "../service";
import {OrderBy, TopicFilter, TopicSort} from "../types";

class TopicController {

    async getById(req: Request, res: Response, next: NextFunction) {
        try {
            const topic = await TopicService.getTopicById(req.params.topic_id)
            return res.status(200).send(topic)
        } catch (err: any) {
            next(err)
        }
    }
    async getByQuery(req: Request, res: Response, next: NextFunction) {
        const {query} = req
        try {
            if (isEmpty(query)) {
                const topics = await TopicService.getTopicsByFilter({})
                return res.status(200).json(topics.map(topic => topic._id))
            } else {
                const filter: TopicFilter = {}
                if (typeof query.name === "string") filter.name = query.name

                const sort: TopicSort = {}
                if (typeof query.sort_by_popularity === "string")
                    sort.sort_by_popularity = ["count", query.sort_by_popularity as OrderBy]

                const topics = await TopicService.getTopicsByFilter(filter, Object.values(sort))
                return res.status(200).json(topics.map(topic => topic._id))
            }

        } catch (err: any) {
            next(err)
        }
    }
}

export default new TopicController()