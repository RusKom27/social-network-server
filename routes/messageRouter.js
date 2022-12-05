const express = require('express')
const router = express.Router()
const Message = require('../models/Message')
const Dialog = require('../models/Dialog')
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
    try {
        const message = await new Message({
            sender_id: await User.findById(req.headers.authorization).then(user => user._id),
            dialog_id: await Dialog.findById(req.body.dialog_id).then(dialog => dialog._id),
            text: req.body.text,
            image: req.body.image,
        })
        const newMessage = await message.save()
        res.status(201).json(newMessage)
    } catch (err) {
        res.status(400).json({message: err.message})
    }
})

module.exports = router