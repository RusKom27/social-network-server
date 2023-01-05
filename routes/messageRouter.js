const express = require('express')

const getUser = require('../middleware/getUser')
const Message = require('../models/Message')
const Dialog = require('../models/Dialog')
const User = require('../models/User')
const {getDialogs, getDialog, getMessage} = require("../helpers/database");
const AblyChannels = require("../packages/ably");

const router = express.Router()

router.get('/', getUser, async (req, res) => {
    getDialogs([req.headers.authorization]).then(dialogs => res.json(dialogs))
})

router.put('/check/:id', getUser, async (req, res) => {
    try {
        Message.findById(req.params.id).then(async message => {
            message.checked = true
            await message.save()
            AblyChannels.messages_channel.publish("check_message", await getMessage(message._id), (error) => console.log(error));
            res.status(200).json(message)
        })
    } catch (err) {
        res.status(400).json({message: err.message})
    }

})

router.post('/', getUser, async (req, res) => {
    try {
        const message = await new Message({
            sender_id: req.user._id,
            dialog_id: await Dialog.findById(req.body.dialog_id).then(dialog => dialog._id),
            text: req.body.text,
            image: req.body.image,
        })
        let newMessage = await message.save()
        AblyChannels.messages_channel.publish("new_message", await getMessage(newMessage._id));
        res.status(201).json({
            ...newMessage._doc,
            sender: req.user
        })

    } catch (err) {
        res.status(400).json({message: err.message})
    }
})

router.post('/create_dialog', async (req, res) => {
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
                AblyChannels.messages_channel.publish("new_dialog", await getDialog(newDialog._id));
                res.json(newDialog)
            }
        })
    } catch (err) {
        res.status(400).json({message: err.message})
    }
})

module.exports = router