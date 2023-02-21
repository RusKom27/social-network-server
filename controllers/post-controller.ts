import {NextFunction, Request, Response} from "express";
import {PostService, TopicService, UserService} from "../service";
import {getTagsFromText} from "../helpers/misc";
import {getUserId} from "../helpers/validation";
import ApiError from "../exeptions/api-error";
import {CustomRequest} from "../types/express/CustomRequest";

class PostController {
    async getByQuery (req: CustomRequest, res: Response, next: NextFunction) {
        try {
            const posts = await PostService.getPostsByFilter(req.filter, req.sort?.post, req.limit)
            return res.status(200).json(posts.map(post => post._id))
        } catch (err: any) {
            next(err)
        }
    }
    async getByPostId (req: Request, res: Response, next: NextFunction) {
        try {
            const post = await PostService.getPostById(req.params.post_id)
            return res.status(200).send(post)
        } catch (err: any) {
            next(err)
        }
    }
    async createPost (req: CustomRequest, res: Response, next: NextFunction) {
        try {
            const user_id = getUserId(req.user_id);
            const user = await UserService.getUserById(user_id)
            const post = await PostService.createPost(
                user._id,
                req.body.text,
                req.body.image,
                getTagsFromText(req.body.text)
            )
            await TopicService.addTopicsFromPost(post)
            return res.status(201).json(post)
        } catch (err: any) {
            next(err)
        }
    }
    async checkPost (req: CustomRequest, res: Response, next: NextFunction) {
        try {
            const user_id = getUserId(req.user_id);
            let post = await PostService.getPostById(req.params.id)
            const user = await UserService.getUserById(user_id)
            let views = post.views
            if (!post.views.map(id => id.toString()).includes(user._id.toString())) {
                views.push(user._id)
                post = await PostService.getPostByIdAndUpdate(post._id, {views})
            }
            const author_user = await UserService.getUserById(post.author_id)
            return res.status(200).json({...post, user: author_user })
        } catch (err: any) {
            next(err)
        }
    }
    async likePost (req: CustomRequest, res: Response, next: NextFunction) {
        try {
            const user_id = getUserId(req.user_id);
            let post = await PostService.getPostById(req.params.id)
            const user = await UserService.getUserById(user_id)
            const user_index = post.likes.map(id => id.toString()).indexOf(user._id.toString())

            let likes = [...post.likes]
            if (user_index > -1) likes.splice(user_index, 1)
            else likes.push(user._id)
            post = await PostService.getPostByIdAndUpdate(post._id, {likes, likesCount: likes.length})

            const author_user = await UserService.getUserById(post.author_id)
            return res.status(201).json({...post, user: author_user})
        } catch (err: any) {
            next(err)
        }
    }
    async deletePost (req: CustomRequest, res: Response, next: NextFunction) {
        try {
            const user_id = getUserId(req.user_id);
            const current_user = await UserService.getUserById(user_id)
            let post = await PostService.getPostById(req.params.id)
            if (post.author_id.toString() === current_user._id.toString()) {
                post = await PostService.getPostByIdAndDelete(post._id)
                return res.json(post)
            } else {
                next(ApiError.BadRequest("You not author of this post"))
            }
        } catch (err: any) {
            next(err)
        }
    }
}

export default new PostController()