const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId

const schema = new mongoose.Schema({
    sender_id: {
        type: ObjectId,
        ref: 'User',
        required: true
    },
    dialog_id: {
        type: ObjectId,
        ref: 'Dialog',
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
    checked: {
        type: Boolean,
        default: false,
    },
    creation_date: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Message', schema, 'messages')