import User from "../models/User"
import Message from "../models/Message"
import Dialog from "../models/Dialog"
import {Types} from "mongoose";

export const getUsers = async (users_id: Types.ObjectId[] | string[]) => {
    return await User.find({_id: {"$in": users_id}}).exec()
}

export const getMessage = async (message_id: Types.ObjectId | string) => {
    const message = await Message.findById(message_id).lean().exec()
    if (!message) return null
    const user = await User.findById(message.sender_id).lean().exec()
    return {
        ...message,
        sender: user
    }
}

export const getMessages = async (dialog_id: Types.ObjectId | string) => {
    const messages = await Message.find({dialog_id}).lean().exec()
    let result = []
    for (let i = 0; i < messages.length; i++) {
        const user = await User.findById(messages[i].sender_id).exec()
        if (!user) return null
        result.push({
            ...messages[i],
            sender: user
        })
    }
    return result
}

export const getDialog = async (dialog_id: Types.ObjectId | string) => {
    const dialog = await Dialog.findById(dialog_id).lean().exec()
    if (!dialog) return null
    const messages = await getMessages(dialog._id)
    const members = await getUsers(dialog.members_id)
    if (!messages || !members) return null
    return {
        ...dialog,
        messages,
        members,
    }
}

export const getDialogs = async (members_id: Types.ObjectId[] | string[]) => {
    const dialogs = await Dialog.find({members_id: { "$in" : members_id}}).exec()
    let result = []
    for (let i = 0; i < dialogs.length; i++) {
        result.push(await getDialog(dialogs[i]._id))
    }
    return result
}