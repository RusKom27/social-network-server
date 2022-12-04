const express = require('express')
const User = require("../models/User");
const router = express.Router()

router.post('/register', async (req, res, next) => {
    const user = new User({
        name: req.body.name,
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
        User.findOne({
            email: req.body.email,
            password: req.body.password
        }).then(user => {
            if (user) res.json(user)
            else res.status(404).json({message: "User not found!"})
        })
    } catch (err) {
        res.status(400).json({message: err.message})
    }
})

module.exports = router