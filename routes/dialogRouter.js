const express = require('express')
const router = express.Router()
const Dialog = require('../models/Dialog')
const Message = require('../models/Message')
const User = require('../models/User')

router.get('/', async (req, res, next) => {
    try {
        await Dialog.find({members_id: { "$in" : [req.headers["authorization"]]}}).then(async dialogs => {
            for (let i = 0; i < dialogs.length; i++) {
                let message = null
                await Message.find({dialog_id: dialogs[i].id}).sort({creation_date: -1}).limit(1).then(async messages => {
                    if (messages[0]) {
                        await User.findById(messages[0].sender_id).then(user =>
                            messages[0] = {
                                ...messages[0]._doc,
                                sender: user,
                            })
                        message = messages[0]
                    }
                })
                let members = []
                for (let member_id of dialogs[i].members_id) {
                    await User.findById(member_id).then( user => {
                            members.push(user)
                        }
                    )
                }
                dialogs[i] = {
                    ...dialogs[i]._doc,
                    message,
                    members,
                }
            }
            res.send(dialogs)
        })

    } catch (err) {
        res.status(500).json({message: err.message})
    }
})

router.get('/:id', async (req, res, next) => {
    try {
        Dialog.findById(req.params.id).then(dialog => res.send(dialog))
    } catch (err) {
        res.status(500).json({message: err.message})
    }
})

router.post('/', async (req, res, next) => {
    try {
        res.headers['Access-Control-Allow-Credentials'] = true
        res.headers['Access-Control-Allow-Origin'] = '*'
        res.headers['Access-Control-Allow-Methods'] = 'GET,OPTIONS,PATCH,DELETE,POST,PUT'
        res.headers['Access-Control-Allow-Headers'] = 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'

        Dialog.findOne({members_id: { "$all" : [req.headers["authorization"], ...req.body.members_id]}}).then(async dialog => {
            if (dialog) res.json(dialog)
            else {
                const dialog = await new Dialog({
                    members_id: [await User.findById(req.headers["authorization"]).then(user => user._id)]
                })
                for (let member_id of req.body.members_id) {
                    dialog.members_id.push(await User.findById(member_id).then(user => user._id))
                }
                const newDialog = await dialog.save()
                res.status(201).json(newDialog)
            }
        })
    } catch (err) {
        res.status(400).json({message: err.message})
    }
})

module.exports = router