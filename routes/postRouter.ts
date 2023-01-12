import {Request, Response, NextFunction} from "express";
import AblyChannels from "../packages/ably";
import express from "express";
import Post from "../models/Post";
import User from "../models/User";

const {getTagsFromText, deletePunctuationMarks} = require("../helpers/misc");

const router = express.Router()

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const posts = await Post.find(req.headers.authorization ? {author_id: req.headers.authorization} : {}).lean().exec()
        const result = []
        for (let i = 0; i < posts.length; i++) {
            const user = await User.findById(posts[i].author_id).exec()
            if (!user) return res.status(404).send({message:"User not found"})
            result.push({...posts[i], user})
        }
        res.json(result)

    } catch (err: any) {
        res.status(500).json({message: err.message})
    }
})

router.get('/popular_tags', async (req: Request, res: Response, next: NextFunction) => {
    try {
        let tags: any = {}
        const posts = await Post.find().exec()
        for (const post of posts) {
            for (const tag of post.tags) {
                tags[tag] = tags[tag] ? tags[tag] + 1 : 1
            }
        }
        let sorted_tags = Object.entries(tags)
        sorted_tags.sort((first: any, second: any) => {
            return first[1] - second[1]
        })
        const result = sorted_tags
            .map(tag => ({[tag[0]]: tag[1]}))
            .reverse()
            .slice(0,10)
        res.status(200).send(result)
    } catch (err: any) {
        res.status(400).json({message: err.message})
    }
})

router.get('/actual_topics', async (req: Request, res: Response, next: NextFunction) => {
    try {
        let topics: any = {}
        const posts = await Post.find().exec()
        for (const post of posts) {
            for (const word of post.text.split(" ")) {
                const topic = deletePunctuationMarks(word)
                topics[topic] = topics[topic] ? topics[topic] + 1 : 1
            }
        }
        let sorted_topics = Object.entries(topics)
        sorted_topics.sort((first: any, second: any) => {
            return first[1] - second[1]
        })
        const result = sorted_topics
            .map(topic => ({[topic[0]]: topic[1]}))
            .reverse()
            .slice(0,10)
        res.status(200).send(result)
    } catch (err: any) {
        res.status(400).json({message: err.message})
    }
})

router.get('/:user_login', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await User.findOne({login: req.params.user_login}).exec()
        if (!user) return res.status(404).send({message: "User not found"})
        const posts = await Post.find({author_id: user._id}).exec()
        let result = []
        for (let i = 0; i < posts.length; i++) {
            result.push({
                ...posts[i],
                user: user
            })
        }
        return res.send(result)
    } catch (err: any) {
        res.status(500).json({message: err.message})
    }
})

router.post('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await User.findById(req.headers.authorization).exec()
        if (!user) return res.status(404).send({message: "User not found"})

        let post = new Post({
            author_id: user._id,
            text: req.body.text,
            image: req.body.image,
            tags: getTagsFromText(req.body.text)
        })
        let newPost: any = await post.save()
        newPost = {...newPost._doc, user }
        AblyChannels.posts_channel.publish("new_post", newPost);
        res.status(201).json(newPost)

    } catch (err: any) {
        res.status(400).json({message: err.message})
    }
})

router.put('/check/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const post = await Post.findById(req.params.id).exec()
        if (!post) return res.status(404).send({message: "Post not found"})
        const user = await User.findById(req.headers.authorization).exec()
        if (!user) return res.status(404).send({message: "User not found"})
        if (!post.views.includes(user._id)) post.views.push(user._id)
        await post.save()
        const author_user = await User.findById(post.author_id).then(user => user)
        AblyChannels.posts_channel.publish(
            "check_post",
            {...post, user: author_user }
        );
        res.status(200).json({...post, user: author_user })

    } catch (err: any) {
        res.status(400).json({message: err.message})
    }
})

router.put('/like/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        await Post.findById(req.params.id).then(async (post: any) => {
            const user = await User.findById(req.headers.authorization).lean().then((user: Document | any) => user)
            const user_index = post.likes.indexOf(user._id)
            if (user_index > -1) post.likes.splice(user_index, 1)
            else post.likes.push(user._id)

            const author_user = await User.findById(post.author_id).then(user => user)
            await post.save()
            AblyChannels.posts_channel.publish("post_like", {...post._doc, user: author_user});
            res.status(201).json({...post._doc, user: author_user})
        })
    } catch (err: any) {
        res.status(400).json({message: err.message})
    }
})

router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        await Post.findOne({_id: req.params.id}).then(async (post: Document | any) => {
            await User.findById(req.headers.authorization).then((user: Document | any) => {
                if (post.author_id.toString() === user._id.toString()) post.delete()
            })

            AblyChannels.posts_channel.publish("delete_post", post);
            res.json(post)
        })
    } catch (err: any) {
        res.status(400).json({message: err.message})
    }
})

export default router