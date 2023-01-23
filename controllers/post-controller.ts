import {NextFunction, Request, Response} from "express";
import {PostService, UserService} from "../service";
import {deletePunctuationMarks, getTagsFromText} from "../helpers/misc";
import {checkToken} from "../helpers/validation";
import {sendMessage} from "../packages/ably";

class PostController {
    async getAll (req: Request, res: Response, next: NextFunction) {
        try {
            const posts = await PostService.getPosts()
            const result = []
            for (let i = 0; i < posts.length; i++) {
                const user = await UserService.getUserById(posts[i].author_id)
                result.push({...posts[i], user})
            }
            return res.json(posts)
        } catch (err: any) {
            return res.status(404).json({message: err.message})
        }
    }
    async getByUserLogin (req: Request, res: Response, next: NextFunction) {
        try {
            const user = await UserService.getUserByFilter({login: req.params.user_login})
            const posts = await PostService.getPostsByAuthorId(user._id)
            let result = []
            for (let i = 0; i < posts.length; i++) {
                result.push({
                    ...posts[i],
                    user: user
                })
            }
            return res.send(result)
        } catch (err: any) {
            return res.status(404).json({message: err.message})
        }
    }
    async getByPostId (req: Request, res: Response, next: NextFunction) {
        try {
            const post = await PostService.getPostById(req.params.post_id)
            return res.status(200).send(post)
        } catch (err: any) {
            return res.status(404).json({message: err.message})
        }
    }
    async getPopularTags (req: Request, res: Response, next: NextFunction) {
        try {
            let tags: any = {}
            const posts = await PostService.getPosts()
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
            return res.status(200).send(result)
        } catch (err: any) {
            return res.status(404).json({message: err.message})
        }
    }
    async getActualTopics (req: Request, res: Response, next: NextFunction) {
        try {
            let topics: any = {}
            const posts = await PostService.getPosts()
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
            return res.status(200).send(result)
        } catch (err: any) {
            return res.status(404).json({message: err.message})
        }
    }
    async createPost (req: Request, res: Response, next: NextFunction) {
        try {
            const token = checkToken(req.headers.authorization);
            const user = await UserService.getUserById(token)
            const post = await PostService.createPost(user._id, req.body.text, req.body.image, getTagsFromText(req.body.text))
            sendMessage(
                "new_post",
                {...post.toObject(), user },
                user.subscribers
            )
            return res.status(201).json({...post.toObject(), user })
        } catch (err: any) {
            return res.status(400).json({message: err.message})
        }
    }
    async checkPost (req: Request, res: Response, next: NextFunction) {
        try {
            const token = checkToken(req.headers.authorization);
            let post = await PostService.getPostById(req.params.id)
            const user = await UserService.getUserById(token)
            let views = post.views
            if (!post.views.map(id => id.toString()).includes(user._id.toString())) {
                views.push(user._id)
                post = await PostService.getPostByIdAndUpdate(post._id, {views})
            }
            const author_user = await UserService.getUserById(post.author_id)
            return res.status(200).json({...post, user: author_user })

        } catch (err: any) {
            return res.status(400).json({message: err.message})
        }
    }
    async likePost (req: Request, res: Response, next: NextFunction) {
        try {
            const token = checkToken(req.headers.authorization);
            let post = await PostService.getPostById(req.params.id)
            const user = await UserService.getUserById(token)
            const user_index = post.likes.map(id => id.toString()).indexOf(user._id.toString())

            let likes = [...post.likes]
            if (user_index > -1) likes.splice(user_index, 1)
            else likes.push(user._id)
            post = await PostService.getPostByIdAndUpdate(post._id, {likes})

            const author_user = await UserService.getUserById(post.author_id)

            sendMessage(
                "post_like",
                {...post, user: author_user},
                [author_user._id]
            )

            return res.status(201).json({...post, user: author_user})
        } catch (err: any) {
            return res.status(400).json({message: err.message})
        }
    }
    async deletePost (req: Request, res: Response, next: NextFunction) {
        try {
            const token = checkToken(req.headers.authorization);
            const current_user = await UserService.getUserById(token)
            let post = await PostService.getPostById(req.params.id)
            if (post.author_id.toString() === current_user._id.toString()) {
                post = await PostService.getPostByIdAndDelete(post._id)
                return res.json(post)
            } else {
                return res.status(404).send({message: "You not author of this post"})
            }
        } catch (err: any) {
            return res.status(400).json({message: err.message})
        }
    }
}

export default new PostController()