import {Dialog} from "../models";
import {Types} from "mongoose";
import ApiError from "../exeptions/api-error";

class DialogService {
    async getDialogById (dialog_id: Types.ObjectId | string) {
        const dialog = await Dialog.findById(dialog_id).lean().exec()
        if (!dialog) throw ApiError.BadRequest("Dialog not found")
        else return dialog
    }

    async getDialogByFilter (filter: any) {
        const dialog = await Dialog.findOne(filter).lean().exec()
        if (!dialog) throw ApiError.BadRequest("Dialog not found")
        else return dialog
    }

    async getDialogsByMembersId (members_id: Types.ObjectId[] | string[]) {
        return await Dialog.find({members_id: { "$in" : members_id}}).lean().exec()
    }

    async createDialog (members_id: Types.ObjectId[] | string[]) {
        const dialog = await Dialog
            .findOne({members_id: { "$all": members_id}})
            .lean()
            .exec()
        if (dialog) return dialog
        let new_dialog = new Dialog({members_id});
        return await new_dialog.save();
    }
}

export default new DialogService()