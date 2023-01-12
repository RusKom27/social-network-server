import {Request, Response, NextFunction} from "express";
import express from "express";
import Post from "../models/Post";
import User from "../models/User";

const router = express.Router()

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        let results: any = {
            topics: [],
            users: [],
        }
        if (!req.query.user_input) return res.send(results)
        const user_input = req.query.user_input.toString().toLowerCase()
        const posts = await Post.find().sort("likes").exec()
        for (const post of posts) {
            for (const word of post.text.split(" ")) {
                const topic = word.toLowerCase()
                if (topic.includes(user_input) &&
                    !results.topics.includes(topic))
                    results.topics.push(topic)
            }
        }
        const users = await User.find().exec()
        for (const user of users) {
            if (user.name.includes(user_input)) results.users.push(user)
            else if (user.login.includes(user_input)) results.users.push(user)
        }
        res.send(results);

    } catch (err: any) {
        res.status(500).json({message: err.message})
    }
    next()
});

export default router