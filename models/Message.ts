import mongoose, {Schema, Types} from "mongoose"
import {IMessage} from "../interfaces";

const MessageSchema: Schema = new Schema({
    sender_id: {
        type: Types.ObjectId,
        ref: 'User',
        required: true
    },
    dialog_id: {
        type: Types.ObjectId,
        ref: 'Dialog',
        required: true
    },
    text: {
        type: String,
        default: "",
    },
    image: {
        type: String,
        default: "",
    },
    checked: {
        type: Boolean,
        default: false,
    },
    creation_date: {
        type: Date,
        default: Date.now
    }
})

export default mongoose.model<IMessage>('Message', MessageSchema, 'messages')