const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId

const schema = new mongoose.Schema({
    members_id: {
        type: [ObjectId],
        ref: 'User',
        required: true
    },
    creation_date: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Dialog', schema, 'dialogs')