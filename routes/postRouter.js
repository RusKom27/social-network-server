const express = require('express')
const router = express.Router()
const Post = require('../models/Post')
const User = require('../models/User')

router.get('/', async (req, res, next) => {
    try {
        await Post.find(
            req.headers.authorization ? {author_id: req.headers.authorization} : {}
        ).then(async posts => {
            for (let i = 0; i < posts.length; i++) {
                await User.findById(posts[i].author_id).then(user => {
                    posts[i] = {...posts[i]._doc, user}
                })
            }
            res.json(posts)
        })

    } catch (err) {
        res.status(500).json({message: err.message})
    }
})

router.get('/:user_login', async (req, res, next) => {
    try {
        User.findOne({login: req.params.user_login}).then(user => {
            Post.find({author_id: user._id}).then(posts => {
                for (let i = 0; i < posts.length; i++) {
                    posts[i] = {
                        ...posts[i]._doc,
                        user: user
                    }
                }
                res.send(posts)
            })
        })
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
    try {
        const user = await User.findById(req.headers.authorization).then(user => user)
        let post = await Post.findById(req.params.id).then(post => post)

        const user_index = post.likes.indexOf(user._id)
        if (user_index > -1) post.likes.splice(user_index, 1)
        else post.likes.push(user._id)

        let author_user = await User.findById(post.author_id).then(user => user)
        let newPost = await post.save()

        res.status(201).json({...newPost._doc, user: author_user})
    } catch (err) {
        res.status(400).json({message: err.message})
    }
})

router.delete('/:id', async (req, res, next) => {
    try {
        await Post.findOne({_id: req.params.id}).then(async post => {
            await User.findById(req.headers.authorization).then(user => {
                console.log(post.author_id.toString() === user._id.toString())
            })

            //post.delete()
        })
        res.json({_id: req.params.id})
    } catch (err) {
        res.status(400).json({message: err.message})
    }

})

module.exports = router