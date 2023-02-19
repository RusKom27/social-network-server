import mongoose, {Schema, Types} from "mongoose"
import {IPost} from "../interfaces";

const PostSchema: Schema = new Schema({
    author_id: {
        type: Types.ObjectId,
        ref: 'User',
        required: true
    },
    text: {
        type: String,
        default: "",
    },
    image: {
        type: String,
        default: "",
    },
    likes: {
        type: [Types.ObjectId],
        ref: 'User',
        default: []
    },
    likesCount: {
        type: Number,
        default: 0,
    },
    tags: {
        type: [String],
        default: []
    },
    views: {
        type: [Types.ObjectId],
        ref: 'User',
        default: [],
    },
    creation_date: {
        type: Date,
        default: Date.now
    }
})

export default mongoose.model<IPost>('Post', PostSchema, 'posts')