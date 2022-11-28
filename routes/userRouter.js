const express = require('express')
const User = require("../models/User");
const router = express.Router()

router.get('/', async (req, res, next) => {
    try {
        User.find().then(users => {
            res.send(users)
        })
    } catch (err) {
        res.status(404).json({message: err.message})
    }
})

router.get('/:id', async (req, res, next) => {
    try {
        User.findById(req.body.id).then(user => {
            res.send(user)
        })
    } catch (err) {
        res.status(404).json({message: err.message})
    }
})

module.exports = router