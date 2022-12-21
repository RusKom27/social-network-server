const User = require("../models/User");
const Message = require("../models/Message");
const Dialog = require("../models/Dialog");

const getUsers = async (users_id) => {
    return User.find({_id: {"$in": users_id}}).then(users => users)
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

const getDialog = async (dialog_id) => {
    return await Dialog.findById(dialog_id).then(async dialog => {
        return {
            ...dialog._doc,
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
    getMessages,
    getDialog,
    getDialogs
}