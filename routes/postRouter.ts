import {Request, Response, NextFunction} from "express";
import AblyChannels, {sendMessage} from "../packages/ably";
import express from "express";
import {getTagsFromText, deletePunctuationMarks} from "../helpers/misc"
import {PostController, UserController} from "../controllers";
import {checkToken} from "../helpers/validation";

const router = express.Router()

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const posts = await PostController.getPosts()
        const result = []
        for (let i = 0; i < posts.length; i++) {
            const user = await UserController.getUserById(posts[i].author_id)
            result.push({...posts[i], user})
        }
        res.json(result)
    } catch (err: any) {
        res.status(404).json({message: err.message})
    }
})

router.get('/popular_tags', async (req: Request, res: Response, next: NextFunction) => {
    try {
        let tags: any = {}
        const posts = await PostController.getPosts()
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
        res.status(404).json({message: err.message})
    }
})

router.get('/actual_topics', async (req: Request, res: Response, next: NextFunction) => {
    try {
        let topics: any = {}
        const posts = await PostController.getPosts()
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
        res.status(404).json({message: err.message})
    }
})

router.get('/:user_login', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await UserController.getUserByFilter({login: req.params.user_login})
        const posts = await PostController.getPostsByAuthorId(user._id)
        let result = []
        for (let i = 0; i < posts.length; i++) {
            result.push({
                ...posts[i],
                user: user
            })
        }
        res.send(result)
    } catch (err: any) {
        res.status(404).json({message: err.message})
    }
})

router.post('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = checkToken(req.headers.authorization);
        const user = await UserController.getUserById(token)
        const post = await PostController.createPost(user._id, req.body.text, req.body.image, getTagsFromText(req.body.text))
        AblyChannels.posts_channel.publish("new_post", {...post.toObject(), user });
        sendMessage(
            "new_post",
            {...post.toObject(), user },
            user.subscribers
        )
        res.status(201).json({...post.toObject(), user })
    } catch (err: any) {
        res.status(400).json({message: err.message})
    }
})

router.put('/check/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = checkToken(req.headers.authorization);
        let post = await PostController.getPostById(req.params.id)
        const user = await UserController.getUserById(token)
        let views = post.views
        if (!post.views.map(id => id.toString()).includes(user._id.toString())) {
            views.push(user._id)
            post = await PostController.getPostByIdAndUpdate(post._id, {views})
        }
        const author_user = await UserController.getUserById(post.author_id)
        res.status(200).json({...post, user: author_user })

    } catch (err: any) {
        res.status(400).json({message: err.message})
    }
})

router.put('/like/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = checkToken(req.headers.authorization);
        let post = await PostController.getPostById(req.params.id)
        const user = await UserController.getUserById(token)
        const user_index = post.likes.map(id => id.toString()).indexOf(user._id.toString())

        let likes = [...post.likes]
        if (user_index > -1) likes.splice(user_index, 1)
        else likes.push(user._id)
        post = await PostController.getPostByIdAndUpdate(post._id, {likes})

        const author_user = await UserController.getUserById(post.author_id)
        AblyChannels.posts_channel.publish("post_like", {...post, user: author_user});

        sendMessage(
            "post_like",
            {...post, user: author_user},
            [author_user._id]
        )

        res.status(201).json({...post, user: author_user})
    } catch (err: any) {
        res.status(400).json({message: err.message})
    }
})

router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = checkToken(req.headers.authorization);
        const current_user = await UserController.getUserById(token)
        let post = await PostController.getPostById(req.params.id)
        if (post.author_id.toString() === current_user._id.toString()) {
            post = await PostController.getPostByIdAndDelete(post._id)
            res.json(post)
        } else {
            res.status(404).send({message: "You not author of this post"})
        }
    } catch (err: any) {
        res.status(400).json({message: err.message})
    }
})

export default router //165