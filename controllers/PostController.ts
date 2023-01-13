import {Types} from "mongoose";
import Post from "../models/Post";
import IPost from "../interfaces/Post";

export default {
    getPostById: async (post_id: Types.ObjectId | string) => {
        const post = await Post.findById(post_id).lean().exec();
        if (!post) throw Error("Post not found");
        else return post;
    },

    getPosts: async () => {
        return await Post.find().lean().exec();
    },

    getPostsByAuthorId: async (author_id: Types.ObjectId | string) => {
        return await Post.find({author_id}).lean().exec();
    },

    createPost: async (author_id: Types.ObjectId | string, text: string, image: string, tags: string[]) => {
        const post = new Post({author_id, text, image, tags});
        return await post.save();
    },

    getPostByIdAndUpdate: async (post_id: Types.ObjectId | string, updates: any) => {
        const post = await Post
            .findByIdAndUpdate(post_id, updates, {returnDocument: 'after'})
            .lean()
            .exec();
        if (!post) throw Error("Post not found");
        else return post;
    },

    getPostByIdAndDelete: async (post_id: Types.ObjectId | string) => {
        const post = await Post.findByIdAndDelete(post_id, {returnDocument: 'after'}).lean().exec()
        if (!post) throw Error("Post not found");
        else return post
    }
};