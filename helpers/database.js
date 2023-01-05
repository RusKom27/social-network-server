const User = require("../models/User");
const Message = require("../models/Message");
const Dialog = require("../models/Dialog");

const getUsers = async (users_id) => {
    return User.find({_id: {"$in": users_id}}).then(users => users)
}

const getMessage = async (message_id) => {
    return Message.findById(message_id).lean().then(async message => {
        await User.findById(message.sender_id).then(user => {
            message = {
                ...message,
                sender: user
            }
        })
        return message
    })
}

const getMessages = async (dialog_id) => {
    return Message.find({dialog_id}).lean().then(async messages => {
        for (let i = 0; i < messages.length; i++) {
            await User.findById(messages[i].sender_id).then(user => {
                messages[i] = {
                    ...messages[i],
                    sender: user
                }
            })
        }
        return messages
    })
}

const getDialog = async (dialog_id) => {
    return await Dialog.findById(dialog_id).lean().then(async dialog => {
        return {
            ...dialog,
            messages: await getMessages(dialog._id),
            members: await getUsers(dialog.members_id)
        }
    })
}

const getDialogs = async (members_id) => {
    return await Dialog.find({members_id: { "$in" : members_id}}).then(async dialogs => {
        for (let i = 0; i < dialogs.length; i++) {
            dialogs[i] = await getDialog(dialogs[i]._id)
        }
        return dialogs
    })
}

module.exports = {
    getUsers,
    getMessage,
    getMessages,
    getDialog,
    getDialogs
}