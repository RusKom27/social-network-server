import {Types} from "mongoose";
import Message from "../models/Message";

export default {
    getMessageById: async (message_id: Types.ObjectId | string) => {
        const message = await Message.findById(message_id).lean().exec()
        if (!message) throw Error("Message not found")
        else return message
    },

    getMessagesByDialogId: async (dialog_id: Types.ObjectId | string) => {
        return await Message.find({dialog_id}).lean().exec()
    },

    getMessageByIdAndUpdate: async (message_id: Types.ObjectId | string, updates: any) => {
        const message = await Message
            .findByIdAndUpdate(message_id, updates, {returnDocument: 'after'})
            .lean()
            .exec();
        if (!message) throw Error("Message not found");
        return message;
    },

    createMessage: async (
        sender_id: Types.ObjectId | string,
        dialog_id: Types.ObjectId | string,
        text: string,
        image: string) => {
        if (!text && image) throw Error("Message body is empty")
        const message = new Message({sender_id, dialog_id, text, image});
        return await message.save()
    }
}