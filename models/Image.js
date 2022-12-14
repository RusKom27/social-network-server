const mongoose = require('mongoose')

const schema = mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    image: {
        data: Buffer,
        contentType: String
    },
}, {timestamps: true});

module.exports = mongoose.model('Image', schema, 'images')