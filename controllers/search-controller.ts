import {NextFunction, Request, Response} from "express";
import Post from "../models/Post";
import User from "../models/User";

class SearchController {
    async search(req: Request, res: Response, next: NextFunction) {
        try {
            let results: any = {
                topics: [],
                users: [],
            }
            console.log(req.query)
            if (!req.query.user_input) return res.send(results)
            const user_input = req.query.user_input.toString().toLowerCase()
            const posts = await Post.find().sort("likesCount").exec()
            for (const post of posts) {
                for (const word of post.text.split(/\s+/g)) {
                    const topic = word.toLowerCase()
                    if (topic.includes(user_input) &&
                        !results.topics.includes(topic))
                        results.topics.push(topic)
                }
            }
            const users = await User.find().sort("subscribers").exec()
            for (const user of users) {
                if (user.name.includes(user_input)) results.users.push(user)
                else if (user.login.includes(user_input)) results.users.push(user)
            }
            return res.send(results);

        } catch (err: any) {
            next(err)
        }
    }
}

export default new SearchController()