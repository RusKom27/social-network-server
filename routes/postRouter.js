const express = require('express')
const router = express.Router()
const Post = require('../models/Post')
const User = require('../models/User')

router.get('/', async (req, res, next) => {
    try {
        let posts = await Post.find({author_id: req.headers.authorization}).then(posts => posts)
        for (let i = 0; i < posts.length; i++) {
            await User.findById(posts[i].author_id).then(user => {
                posts[i] = {...posts[i]._doc, user}
            })
        }
        res.json(posts)
    } catch (err) {
        res.status(500).json({message: err.message})
    }
})

router.get('/:id', async (req, res, next) => {
    try {
        Post.findById(req.body.id).then(post => res.send(post))
    } catch (err) {
        res.status(500).json({message: err.message})
    }
})

router.post('/', async (req, res) => {
    const user = await User.findById(req.headers.authorization).then(user => user)
    let post = await new Post({
        author_id: user._id,
        text: req.body.text,
        image: req.body.image,
    })
    try {
        let newPost = await post.save()
        res.status(201).json({...newPost._doc, user})
    } catch (err) {
        res.status(400).json({message: err.message})
    }
})

router.put('/like/:id', async (req, res) => {
    const user = await User.findById(req.headers.authorization).then(user => user)
    let post = await Post.findById(req.params.id).then(post => post)
    const user_index = post.likes.indexOf(user._id)
    if (user_index > -1) post.likes.splice(user_index, 1)
    else post.likes.push(user._id)
    try {
        let newPost = await post.save()
        res.status(201).json({...newPost._doc, user})
    } catch (err) {
        res.status(400).json({message: err.message})
    }
})

module.exports = router