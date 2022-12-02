const express = require('express')
const router = express.Router()
const Dialog = require('../models/Dialog')
const Message = require('../models/Message')
const User = require('../models/User')

router.get('/', async (req, res, next) => {
    try {
        let dialogs = await Dialog.find({members_id: { "$in" : [req.headers["user-id"]]}}).then(dialogs => dialogs)
        for (let i = 0; i < dialogs.length; i++) {
            await Message.find({dialog_id: dialogs[i].id}).then(messages => {
                dialogs[i] = {
                    id: dialogs[i].id,
                    members: dialogs[i].members_id,
                    messages,
                    creation_date: dialogs[i].creation_date
                }
            })
        }
        res.send(dialogs)
    } catch (err) {
        res.status(500).json({message: err.message})
    }
})

router.get('/:id', async (req, res, next) => {
    try {
        Dialog.findById(req.body.id).then(dialog => res.send(dialog))
    } catch (err) {
        res.status(500).json({message: err.message})
    }
})

router.post('/', async (req, res, next) => {
    const dialog = await new Dialog({
        members_id: []
    })
    for (let member_id of req.body.members_id) {
        dialog.members_id.push(await User.findById(member_id).then(user => user._id))
    }
    try {
        const newDialog = await dialog.save()
        res.status(201).json(newDialog)
    } catch (err) {
        res.status(400).json({message: err.message})
    }
})

module.exports = router