import {Types} from "mongoose";
import {Message} from "../models";
import ApiError from "../exeptions/api-error";

class MessageService {
    async getMessageById(id: Types.ObjectId | string) {
        const message = await Message.findById(id).lean().exec();
        if (!message) throw ApiError.BadRequest("Message not found");
        else return message;
    }

    async getMessagesByFilter(dialog_id: string, filter: any, sort?: any[], limit=10) {
        return await Message.findOne({dialog_id}).find(filter).sort(sort).limit(limit).lean().exec();
    }

    async getMessagesByDialogId(dialog_id: Types.ObjectId | string) {
        return await Message.find({dialog_id}).lean().exec();
    }

    async getMessageByIdAndUpdate(message_id: Types.ObjectId | string, updates: any) {
        const message = await Message
            .findByIdAndUpdate(message_id, updates, {returnDocument: 'after'})
            .lean()
            .exec();
        if (!message) throw ApiError.BadRequest("Message not found");
        return message;
    }

    async createMessage(
        sender_id: Types.ObjectId | string,
        dialog_id: Types.ObjectId | string,
        text?: string,
        image?: string
    ) {
        if (!text && image) throw ApiError.BadRequest("Message body is empty");
        const message = new Message({sender_id, dialog_id, text, image});
        return await message.save();
    }

    async getMessageByIdAndDelete(message_id: Types.ObjectId | string) {
        const message = await Message.findByIdAndDelete(message_id, {returnDocument: 'after'}).lean().exec();
        if (!message) throw ApiError.BadRequest("Message not found");
        else return message;
    }
}

export default new MessageService();