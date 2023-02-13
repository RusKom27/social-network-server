import {NextFunction, Request, Response} from "express";
import {getUserId} from "../helpers/validation";
import {UserService, DialogService, MessageService, PostService} from "../service"

import {CustomRequest} from "../types/express/CustomRequest";
import ApiError from "../exeptions/api-error";

class MessageController {
    async getMessages (req: CustomRequest, res: Response, next: NextFunction) {
        try {
            const messages = await MessageService.getMessagesByDialogId(req.params.dialog_id);
            return res.status(200).send(messages);
        } catch (err: any) {
            next(err)
        }
    }

    async checkMessage (req: Request, res: Response, next: NextFunction) {
        try {
            const message = await MessageService.getMessageByIdAndUpdate(req.params.id, {checked: true});
            return res.status(200).send(message);
        } catch (err: any) {
            next(err)
        }
    }

    async createMessage (req: CustomRequest, res: Response, next: NextFunction) {
        try {
            const user_id = getUserId(req.user_id);
            const user = await UserService.getUserById(user_id);
            const dialog = await DialogService.getDialogById(req.body.dialog_id);
            const message = await MessageService.createMessage(user._id, dialog._id, req.body.text, req.body.image);
            return res.status(201).json(message);
        } catch (err: any) {
            next(err)
        }
    }

    async deleteMessage (req: CustomRequest, res: Response, next: NextFunction) {
        try {
            const user_id = getUserId(req.user_id);
            const current_user = await UserService.getUserById(user_id)
            let message = await MessageService.getMessageById(req.params.id)
            if (message.sender_id.toString() === current_user._id.toString()) {
                message = await MessageService.getMessageByIdAndDelete(message._id)
                return res.json(message)
            } else {
                next(ApiError.BadRequest("You not author of this message"))
            }
        } catch (err: any) {
            next(err)
        }
    }
}

export default new MessageController()