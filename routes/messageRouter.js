const express = require('express')
const router = express.Router()
const Message = require('../models/Message')
const User = require('../models/User')

router.get('/', async (req, res, next) => {
    try {
        Message.find().then(messages => res.send(messages))
    } catch (err) {
        res.status(500).json({message: err.message})
    }
})

router.get('/:id', async (req, res, next) => {
    try {
        Message.findById(req.body.id).then(message => res.send(message))
    } catch (err) {
        res.status(500).json({message: err.message})
    }
})

router.post('/', async (req, res, next) => {
    const message = await new Message({
        sender_id: await User.findById(req.body.sender_id).then(user => user._id),
        receiver_id: await User.findById(req.body.receiver_id).then(user => user._id),
        text: req.body.text,
        image: req.body.image,
    })
    try {
        const newMessage = await message.save()
        res.status(201).json(newMessage)
    } catch (err) {
        res.status(400).json({message: err.message})
    }
})

module.exports = router