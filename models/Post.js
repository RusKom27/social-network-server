const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId

const schema = new mongoose.Schema({
    author_id: {
        type: ObjectId,
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
        type: Number,
        default: 0,
    },
    dislikes: {
        type: Number,
        default: 0,
    },
    creation_date: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Post', schema, 'posts')