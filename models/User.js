const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId

const schema = new mongoose.Schema({
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
                default: "default_big_avatar_image.png",
            },
            small: {
                type: String,
                default: "default_small_avatar_image.png",
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
        type: [ObjectId],
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

module.exports = mongoose.model('User', schema, 'users')