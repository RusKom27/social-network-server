import mongoose, {Schema, Types} from "mongoose"
import {IUser} from "../interfaces";

const UserSchema: Schema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    login: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    description: {
        type: String,
        default: "",
    },
    images: {
        avatar_image: {
            big: {
                type: String,
                default: "default_big_avatar_image.jpg",
            },
            small: {
                type: String,
                default: "default_small_avatar_image.jpg",
            }
        },
        profile_image: {
            big: {
                type: String,
                default: "default_big_profile_image.png",
            },
            small: {
                type: String,
                default: "default_small_profile_image.png",
            }
        },
    },
    subscribers: {
        type: [Types.ObjectId],
        default: []
    },
    password: {
        type: String,
        required: true,
    },
    creation_date: {
        type: Date,
        default: Date.now
    }
})

export default mongoose.model<IUser>('User', UserSchema, 'users')