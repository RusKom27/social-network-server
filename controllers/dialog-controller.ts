import {NextFunction, Request, Response} from "express";
import {getUserId} from "../helpers/validation";
import {DialogService} from "../service";
import {CustomRequest} from "../types/express/CustomRequest";

class DialogController {
    async getDialogs (req: CustomRequest, res: Response, next: NextFunction) {
        try {
            const user_id = getUserId(req.user_id);
            const dialogs = await DialogService.getDialogsByMembersId([user_id]);
            return res.status(201).send(dialogs);
        } catch (err: any) {
            next(err);
        }
    }

    async createDialog (req: CustomRequest, res: Response, next: NextFunction) {
        try {
            const user_id = getUserId(req.user_id);
            const dialog = await DialogService.createDialog([user_id, ...req.body.members_id]);
            return res.status(202).send(dialog);
        } catch (err: any) {
            next(err);
        }
    }
}

export default new DialogController();