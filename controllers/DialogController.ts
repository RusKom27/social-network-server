import Dialog from "../models/Dialog";
import {Types} from "mongoose";

export default {
    getDialogById: async (dialog_id: Types.ObjectId | string) => {
        const dialog = await Dialog.findById(dialog_id).lean().exec()
        if (!dialog) throw Error("Dialog not found")
        else return dialog
    },

    getDialogByFilter: async (filter: any) => {
        const dialog = await Dialog.findOne(filter).lean().exec()
        if (!dialog) throw Error("Dialog not found")
        else return dialog
    },

    getDialogsByMembersId: async (members_id: Types.ObjectId[] | string[]) => {
        return await Dialog.find({members_id: { "$in" : members_id}}).lean().exec()
    },

    createDialog: async (members_id: Types.ObjectId[] | string[]) => {
        const dialog = await Dialog
            .findOne({members_id: { "$all": members_id}})
            .lean()
            .exec()
        if (dialog) return dialog
        let new_dialog = new Dialog({members_id});
        return await new_dialog.save();
    }

}