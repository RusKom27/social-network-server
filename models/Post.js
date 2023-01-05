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
        type: [ObjectId],
        ref: 'User',
        default: []
    },
    tags: {
        type: [String],
        default: []
    },
    views: {
        type: [ObjectId],
        ref: 'User',
        default: [],
    },
    creation_date: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Post', schema, 'posts')