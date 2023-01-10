const Post = require("../models/Post");
const User = require("../models/User");
const {deletePunctuationMarks} = require("../helpers/misc");
const express = require("express");

const router = express.Router()

router.get('/', (req, res) => {

    try {
        let results = {
            topics: [],
            users: [],
        }
        if (!req.query.user_input) res.send(results)
        else {
            const user_input = req.query.user_input.toLowerCase()
            Post.find().lean().sort("likes").then(posts => {

                for (const post of posts) {
                    for (const word of post.text.split(" ")) {
                        const topic = word.toLowerCase()
                        if (topic.includes(user_input) &&
                            !results.topics.includes(topic))
                            results.topics.push(topic)
                    }
                }
                User.find().lean().then(users => {
                    for (const user of users) {
                        if (user.name.includes(user_input)) results.users.push(user)
                        else if (user.login.includes(user_input)) results.users.push(user)
                    }
                    res.send(results);
                })

            }).catch(reason => res.json({message: reason.message}));
        }

    } catch (err) {
        res.status(500).json({message: err.message})
    }

});

module.exports = router