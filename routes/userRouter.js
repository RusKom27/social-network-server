const express = require('express')
const User = require("../models/User");
const router = express.Router()

router.get('/:login', async (req, res, next) => {
    try {
        User.findOne({login: req.params.login}).then(user => { //pagination .skip(0).limit(1)
            if (user) res.send(user)
            else res.status(404).json({message: "User not found!"})
        })
    } catch (err) {
        res.status(404).json({message: err.message})
    }
})

router.get('/', async (req, res, next) => {
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

module.exports = router