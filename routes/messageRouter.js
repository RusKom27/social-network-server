const express = require('express')
const getUser = require('../middleware/getUser')
const getDialog = require('../middleware/getDialog')
const Message = require('../models/Message')
const Dialog = require('../models/Dialog')
const User = require('../models/User')
const events = require("events");

const router = express.Router()
const emitter = new events.EventEmitter()


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

const getDialogs = async (req, res) => {
    await Dialog.find({members_id: { "$in" : [req.params.token]}}).then(async dialogs => {
        for (let i = 0; i < dialogs.length; i++) {
            dialogs[i] = {
                ...dialogs[i]._doc,
                messages: await getMessages(dialogs[i]._id),
                members: await getMembers(dialogs[i].members_id)
            }
        }
        res.write(`data: ${JSON.stringify(dialogs)} \n\n`)
    })
}

router.get('/connect/:token', async (req, res) => {
    res.writeHead(200, {
        'Connection': 'keep-alive',
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
    })
    await getDialogs(req, res)
    emitter.on('newMessage', async message => {
        await getDialogs(req, res)
    })
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
            sender_id: req.user._id,
            dialog_id: req.dialog._id,
            text: req.body.text,
            image: req.body.image,
        })
        let newMessage = await message.save()
        emitter.emit('newMessage', newMessage)
        res.status(201).json({
            ...newMessage._doc,
            sender: req.user
        })

    } catch (err) {
        res.status(400).json({message: err.message})
    }
})

router.post('/create_dialog', async (req, res, next) => {
    try {
        await Dialog.findOne({members_id: { "$all" : [req.headers["authorization"], ...req.body.members_id]}}).then(async dialog => {
            if (dialog) { res.json(dialog) }
            else {
                let members_id = [await User.findById(req.headers["authorization"]).then( user => user._id)]
                for (let member_id of req.body.members_id) {
                    members_id.push(await User.findById(member_id).then(user => user._id))
                }
                let newDialog = new Dialog({members_id})
                await newDialog.save()
                res.json(dialog)
            }
        })
    } catch (err) {
        res.status(400).json({message: err.message})
    }
})

module.exports = router