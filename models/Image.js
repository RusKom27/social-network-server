const mongoose = require('mongoose')

const schema = mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    image: {
        type: Buffer,
    },
    contentType: {
        type: String
    }
}, {timestamps: true});

module.exports = mongoose.model('Image', schema, 'images')