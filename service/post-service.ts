import {Types} from "mongoose";
import {Post} from "../models";
import ApiError from "../exeptions/api-error";
import {PostFilter, PostSort, OrderBy} from "../types";

class PostService {
    async getPostById(post_id: Types.ObjectId | string) {
        const post = await Post.findById(post_id).lean().exec();
        if (!post) throw ApiError.BadRequest("Post not found");
        else return post;
    }

    async getPostsByFilter(filter: PostFilter, sort?: any[]) {
        await Post.aggregate([
            {"$project": {
                "_id": 1,
                "author_id": 1,
                "text": 1,
                "image": 1,
                "tags": 1,
                "likes": 1,
                "views": 1,
                "creation_date": 1,
                "likesCount": {"$size": "$likes"}
            }},
            {"$out": "posts"}
        ]).exec()
        return await Post.find(filter).sort(sort).lean().exec()
    }

    async getPostsByAuthorId(author_id: Types.ObjectId | string) {
        return await Post.find({author_id}).lean().exec();
    }

    async createPost(author_id: Types.ObjectId | string, text: string, image: string, tags: string[]) {
        const post = new Post({author_id, text, image, tags});
        return await post.save();
    }

    async getPostByIdAndUpdate(post_id: Types.ObjectId | string, updates: any) {
        const post = await Post
            .findByIdAndUpdate(post_id, updates, {returnDocument: 'after'})
            .lean()
            .exec();
        if (!post) throw ApiError.BadRequest("Post not found");
        else return post;
    }

    async getPostByIdAndDelete(post_id: Types.ObjectId | string) {
        const post = await Post.findByIdAndDelete(post_id, {returnDocument: 'after'}).lean().exec()
        if (!post) throw ApiError.BadRequest("Post not found");
        else return post
    }
}

export default new PostService()