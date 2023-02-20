import mongoose, {Schema, Types} from "mongoose"
import {ITopic} from "../interfaces";

const TopicSchema: Schema = new Schema({
    name: {
        type: String,
        required: true,
    },
    posts: {
        type: [Types.ObjectId],
        ref: 'Post',
        required: true
    },
    count: {
        type: Number,
        default: 1
    }
}, {timestamps: true})

export default mongoose.model<ITopic>('Topic', TopicSchema, 'topics')