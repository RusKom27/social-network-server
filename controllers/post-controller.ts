import {NextFunction, Request, Response} from "express";
import {PostService, UserService} from "../service";
import {deletePunctuationMarks, getTagsFromText} from "../helpers/misc";
import {getUserId} from "../helpers/validation";
import {sendMessage} from "../packages/ably";
import ApiError from "../exeptions/api-error";
import {CustomRequest} from "../types/express/CustomRequest";
import {IPost, IUser} from "../interfaces";
import {PostFilter, PostSort, OrderBy} from "../types";

class PostController {
    async getByQuery (req: Request<PostFilter, PostSort>, res: Response, next: NextFunction) {
        const {query} = req
        try {
            const queries = Object.entries(query)
            console.log(queries)
            if (queries.length < 1) {
                const posts = await PostService.getPostsByFilter({})
                return res.status(200).json(posts.map(post => post._id))
            } else {
                const filter: PostFilter = {}
                if (typeof query.author_id === "string") filter.author_id = query.author_id
                if (typeof query.text === "string") filter.text = new RegExp(`${query.text}`, "g")
                if (typeof query.likes === "string") filter.likes = {"$all": [query.likes]}
                if (typeof query.follows === "string") {
                    const followed_users = await UserService.getUsersByUserFollows(query.follows);
                    filter.author_id = {"$in": followed_users.map(user => user._id.toString())}
                }

                const sort: PostSort = {}
                if (typeof query.sort_by_popularity === "string")
                    sort.sort_by_popularity = ["likesCount", query.sort_by_popularity as OrderBy]
                if (typeof query.sort_by_relevance === "string")
                    sort.sort_by_relevance = ["creation_date", query.sort_by_relevance as OrderBy]

                const posts = await PostService.getPostsByFilter(filter, Object.values(sort))
                return res.status(200).json(posts.map(post => post._id))
            }
        } catch (err: any) {
            next(err)
        }
    }
    async getByUserLogin (req: Request, res: Response, next: NextFunction) {
        try {
            const user = await UserService.getUserByFilter({login: req.params.user_login})
            const posts = await PostService.getPostsByAuthorId(user._id)
            return res.status(200).send(posts.map(post => post._id))
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
    async getPopularTags (req: Request, res: Response, next: NextFunction) {
        try {
            let tags: any = {}
            const posts = await PostService.getPostsByFilter({})
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
            next(err)
        }
    }
    async getActualTopics (req: Request, res: Response, next: NextFunction) {
        try {

            type Topic = {value: string, count: number};

            let topics: Topic[] = [];
            const posts = await PostService.getPostsByFilter({})
            for (const post of posts) {
                for (const word of post.text.trim().split(/\s+/)) {
                    const topic_word = deletePunctuationMarks(word)
                    const candidate = topics.find(topic => topic.value === topic_word);
                    if (candidate) candidate.count += 1;
                    else topics.push({value: topic_word, count: 1});
                }
            }

            topics.sort((first: any, second: any) => {
                return first[1] - second[1]
            })

            const result = topics
                .reverse()
                .slice(0,10)
            return res.status(200).send(result)
        } catch (err: any) {
            next(err)
        }
    }
    async createPost (req: CustomRequest, res: Response, next: NextFunction) {
        try {
            const user_id = getUserId(req.user_id);
            const user = await UserService.getUserById(user_id)
            const post = await PostService.createPost(user._id, req.body.text, req.body.image, getTagsFromText(req.body.text))
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