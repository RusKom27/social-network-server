const express = require('express')
const User = require("../models/User");
const router = express.Router()

router.get('/', async (req, res, next) => {
    try {
        const users = User.find().then(users => {
            res.send(users)
        })
    } catch (err) {
        res.status(404).json({message: err.message})
    }
})

module.exports = router