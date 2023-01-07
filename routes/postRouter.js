const express = require('express')

const Post = require('../models/Post')
const User = require('../models/User')
const getUser = require('../middleware/getUser')
const AblyChannels = require("../packages/ably")
const {getTagsFromText} = require("../helpers/misc");
const {getUsers} = require("../helpers/database");

const router = express.Router()

router.get('/', async (req, res) => {
    try {
        await Post.find(
            req.headers.authorization ? {author_id: req.headers.authorization} : {}
        ).lean().then(async posts => {
            for (let i = 0; i < posts.length; i++) {
                await User.findById(posts[i].author_id).then(user => {
                    posts[i] = {...posts[i], user}
                })
            }
            res.json(posts)
        })

    } catch (err) {
        res.status(500).json({message: err.message})
    }
})

router.get('/popular_tags', async (req, res) => {
    try {
        let tags = {}
        await Post.find().then(async posts => {
            for (const post of posts) {
                for (const tag of post.tags) {
                    tags[tag] = tags[tag] ? tags[tag] + 1 : 1
                }
            }
            let sorted_tags = Object.entries(tags)
            sorted_tags.sort((first, second) => {
                return first[1] - second[1]
            })
            sorted_tags = sorted_tags.map(tag => ({[tag[0]]: tag[1]})).reverse().slice(0,10)
            res.status(200).send(sorted_tags)
        })
    } catch (err) {
        res.status(400).json({message: err.message})
    }
})

router.get('/:user_login', async (req, res) => {
    try {
        User.findOne({login: req.params.user_login}).then(user => {
            if (!user) res.status(404).send({message: "User not found"})
            else {
                Post.find({author_id: user._id}).lean().then(posts => {
                    for (let i = 0; i < posts.length; i++) {
                        posts[i] = {
                            ...posts[i],
                            user: user
                        }
                    }
                    res.send(posts)
                })
            }
        })
    } catch (err) {
        res.status(500).json({message: err.message})
    }
})

router.post('/', getUser, async (req, res) => {
    try {
        let post = await new Post({
            author_id: req.user._id,
            text: req.body.text,
            image: req.body.image,
            tags: getTagsFromText(req.body.text)
        })
        let newPost = await post.save()
        newPost = {...newPost._doc, user: req.user }
        AblyChannels.posts_channel.publish("new_post", newPost);
        res.status(201).json(newPost)
    } catch (err) {
        res.status(400).json({message: err.message})
    }
})

router.put('/check/:id', getUser, async (req, res) => {
    try {
        Post.findById(req.params.id).then(async post => {
            if (!post.views.includes(req.user._id)) post.views.push(req.user._id)
            await post.save()
            const author_user = await User.findById(post.author_id).then(user => user)
            AblyChannels.posts_channel.publish(
                "check_post",
                {...post._doc, user: author_user },
                (error) => console.log(error));
            res.status(200).json({...post._doc, user: author_user })
        })
    } catch (err) {
        res.status(400).json({message: err.message})
    }

})

router.put('/like/:id', getUser, async (req, res) => {
    try {
        await Post.findById(req.params.id).then(async post => {
            const user_index = post.likes.indexOf(req.user._id)
            if (user_index > -1) post.likes.splice(user_index, 1)
            else post.likes.push(req.user._id)

            const author_user = await User.findById(post.author_id).then(user => user)
            await post.save()
            AblyChannels.posts_channel.publish("post_like", {...post._doc, user: author_user});
            res.status(201).json({...post._doc, user: author_user})
        })
    } catch (err) {
        res.status(400).json({message: err.message})
    }
})

router.delete('/:id', async (req, res) => {
    try {
        await Post.findOne({_id: req.params.id}).then(async post => {
            await User.findById(req.headers.authorization).then(user => {
                if (post.author_id.toString() === user._id.toString()) post.delete()
            })

            AblyChannels.posts_channel.publish("delete_post", post);
            res.json(post)
        })
    } catch (err) {
        res.status(400).json({message: err.message})
    }
})



module.exports = router