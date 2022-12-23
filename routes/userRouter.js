const express = require('express')
const User = require("../models/User");
const getUser = require("../middleware/getUser");
const router = express.Router()

router.get('/:login', async (req, res) => {
    try {
        User.findOne({login: req.params.login}).then(user => { //pagination .skip(0).limit(1)
            if (user) res.send(user)
            else res.status(404).json({message: "User not found!"})
        })
    } catch (err) {
        res.status(404).json({message: err.message})
    }
})

router.get('/', async (req, res) => {
    try {
        if (req.headers.authorization)
            User.findById(req.headers.authorization).then(user => { //pagination .skip(0).limit(1)
                if (user) res.send(user)
                else res.status(404).json({message: "User not found!"})
            })
    } catch (err) {
        res.status(404).json({message: err.message})
    }
})

router.post('/update', async (req, res) => {
    User.findByIdAndUpdate(req.headers.authorization, req.body).then(user => {
        console.log(user)
        res.json(user)
    })
})

router.put('/subscribe/:user_login', getUser, async (req, res) => {
    try {
        if (req.params.user_login)
            User.findOne({login: req.params.user_login}).then(user => {
                if (user.subscribers.indexOf(req.user._id) < 0) {
                    user.subscribers = [
                        ...user.subscribers,
                        req.user._id
                    ]
                    user.save()
                    res.json(user)
                } else {
                    user.subscribers = user.subscribers.filter((user) => !user._id.equals(req.user._id))
                    user.save()
                    res.json(user)
                }
            })
    } catch (err) {
        res.status(404).json({message: err.message})
    }
})

module.exports = router