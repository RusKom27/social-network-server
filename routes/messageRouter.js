const express = require('express')
const router = express.Router()
const getUser = require('../middleware/getUser')
const getDialog = require('../middleware/getDialog')
const Message = require('../models/Message')
const Dialog = require('../models/Dialog')
const User = require('../models/User')

const getDialogs = async (req) => {
    return Dialog.find({members_id: { "$in" : [req.headers["authorization"]]}}).then(dialogs => dialogs)
}

const getMembers = async (members_id) => {
    return User.find({_id: {"$in": members_id}}).then(users => users)
}

const getMessages = async (dialog_id) => {
    return Message.find({dialog_id}).then(async messages => {
        for (let i = 0; i < messages.length; i++) {
            await User.findById(messages[i].sender_id).then(user => {
                messages[i] = {
                    ...messages[i]._doc,
                    sender: user
                }
            })
        }
        return messages
    })
}

router.get('/', getUser, async (req, res) => {
    try {
        getDialogs(req).then(async dialogs => {
            for (let i = 0; i < dialogs.length; i++) {
                dialogs[i] = {
                    ...dialogs[i]._doc,
                    messages: await getMessages(dialogs[i]._id),
                    members: await getMembers(dialogs[i].members_id)
                }
            }
            res.send(dialogs)
        })
    } catch (err) {
        res.status(500).json({message: err.message})
    }
})

router.get('/:dialog_id', async (req, res, next) => {
    try {
        await Message.find({dialog_id: req.params.dialog_id}).then(async messages => {
            for (let i = 0; i < messages.length; i++) {
                await User.findById(messages[i].sender_id).then(user => {
                    messages[i] = {
                        ...messages[i]._doc,
                        sender: user
                    }
                })
            }

            res.send(messages)
        })
    } catch (err) {
        res.status(500).json({message: err.message})
    }
})

router.post('/', getUser, getDialog, async (req, res, next) => {
    try {
        const message = await new Message({
            sender_id: req.user,
            dialog_id: req.dialog,
            text: req.body.text,
            image: req.body.image,
        })
        let newMessage = await message.save()
        res.status(201).json({
            ...newMessage,
            sender: req.user
        })

    } catch (err) {
        res.status(400).json({message: err.message})
    }
})

module.exports = router