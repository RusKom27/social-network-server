const express = require('express')
const User = require("../models/User");
const router = express.Router()

router.post('/register', async (req, res, next) => {
    const user = new User({
        login: req.body.login,
        email: req.body.email,
        password: req.body.password,
    })
    try {
        const newUser = await user.save()
        res.status(201).json(newUser)
    } catch (err) {
        res.status(400).json({message: err.message})
    }
})

router.post('/login', async (req, res, next) => {
    try {
        if (req.body.password) {
            if (req.body.email)
                User.findOne({
                    email: req.body.email,
                    password: req.body.password
                })
                .then(user => res.json(user))
        }
    } catch (err) {
        res.status(400).json({message: err.message})
    }
})

module.exports = router