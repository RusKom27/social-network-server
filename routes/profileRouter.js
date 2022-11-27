const express = require('express')
const router = express.Router()
const Post = require('../models/Post')
const User = require('../models/User')

router.get('/', async (req, res, next) => {
    try {
        const posts = await Post.find()
        res.send(posts)
    } catch (err) {
        res.status(500).json({message: err.message})
    }
})

router.post('/', async (req, res, next) => {
    const post = await new Post({
        author_id: await User.findById(req.body.author_id).then(user => user._id),
        text: req.body.text,
        image: req.body.image,
    })
    try {
        const newPost = await post.save()
        res.status(201).json(newPost)
    } catch (err) {
        res.status(400).json({message: err.message})
    }
})

module.exports = router