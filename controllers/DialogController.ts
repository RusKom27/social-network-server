import Dialog from "../models/Dialog";
import {Types} from "mongoose";

export default {
    getDialog: async (dialog_id: Types.ObjectId | string) => {
        const dialog = await Dialog.findById(dialog_id).lean().exec()
        if (!dialog) throw Error("Dialog not found")
        return dialog
    },



}