import {Request, Response, NextFunction} from "express";
import AblyChannels from "../packages/ably";
import express from "express";
import User from "../models/User";
import Message from "../models/Message";
import Dialog from "../models/Dialog";

const router = express.Router()
const {getDialogs, getDialog, getMessage} = require("../helpers/database");

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await User.findById(req.headers.authorization).exec()
        if (!user) return res.status(404).send({message: "User not found"})
        const dialogs = await getDialogs([req.headers.authorization])
        res.status(200).send(dialogs)
    } catch (err: any) {
        res.status(400).json({message: err.message})
    }
    next()
})

router.put('/check/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        let message = await Message.findById(req.params.id).exec()
        if (!message) return res.status(404).send({message:"Message not found"})
        message.checked = true
        await message.save()
        AblyChannels.messages_channel
            .publish(
                "check_message",
                await getMessage(message._id)
            );
        res.status(200).json(message)
    } catch (err: any) {
        res.status(400).json({message: err.message})
    }
    next()
})

router.post('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await User.findById(req.headers.authorization).exec()
        if (!user) return res.status(404).send({message: "User not found"})
        const dialog = await Dialog.findById(req.body.dialog_id).exec()
        if (!dialog) return res.status(404).send({message: "Dialog not found"})
        const message = new Message({
            sender_id: user._id,
            dialog_id: dialog._id,
            text: req.body.text,
            image: req.body.image,
        })
        let newMessage = await message.save()
        AblyChannels.messages_channel
            .publish(
                "new_message",
                await getMessage(newMessage._id)
            );
        res.status(201).json({
            ...newMessage,
            sender: user
        })

    } catch (err: any) {
        res.status(400).json({message: err.message})
    }
    next()
})

router.post('/create_dialog', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await User.findById(req.headers.authorization).exec()
        if (!user) return res.status(404).send({message: "User not found"})
        const dialog = await Dialog.findOne({members_id: { "$all": [user._id, ...req.body.members_id]}})
        if (dialog) return res.json(dialog)
        let members_id = [user._id]
        for (let member_id of req.body.members_id) {
            const member = await User.findById(member_id).exec()
            if (!member) return res.status(404).send({message: "Member not found"})
            members_id.push(member._id)
        }
        let newDialog = new Dialog({members_id})
        await newDialog.save()
        AblyChannels.messages_channel.publish("new_dialog", await getDialog(newDialog._id));
        res.json(newDialog)
    } catch (err: any) {
        res.status(400).json({message: err.message})
    }
    next()
})

export default router