import {NextFunction, Request, Response} from "express";
import {TopicService} from "../service";
import {CustomRequest} from "../types/express/CustomRequest";

class TopicController {

    async getById(req: Request, res: Response, next: NextFunction) {
        try {
            const topic = await TopicService.getTopicById(req.params.topic_id)
            return res.status(200).send(topic)
        } catch (err: any) {
            next(err)
        }
    }
    async getByQuery(req: CustomRequest, res: Response, next: NextFunction) {
        try {
            const topics = await TopicService.getTopicsByFilter(req.filter, req.sort?.topic, req.limit)
            return res.status(200).json(topics.map(topic => topic._id))

        } catch (err: any) {
            next(err)
        }
    }
}

export default new TopicController()