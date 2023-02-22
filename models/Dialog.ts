import mongoose, {Schema, Types} from "mongoose";
import {IDialog} from "../interfaces";

const DialogSchema: Schema = new Schema({
    members_id: {
        type: [Types.ObjectId],
        ref: 'User',
        required: true,
    },
}, {timestamps: true});

export default mongoose.model<IDialog>('Dialog', DialogSchema, 'dialogs');