import {NextFunction, Request, Response} from "express";
import {checkToken} from "../helpers/validation";
import {UserService, DialogService, MessageService} from "../service"
import {sendMessage} from "../packages/ably";

class MessageController {
    async getAllMessages (req: Request, res: Response, next: NextFunction) {
        try {
            const token = checkToken(req.headers.authorization);
            const user = await UserService.getUserById(token);
            const dialogs = await DialogService.getDialogsByMembersId([user._id]);
            let result = [];
            for (const dialog of dialogs) {
                const messages = await MessageService.getMessagesByDialogId(dialog._id);
                let messages_with_users = [];
                for (const message of messages) {
                    const user = await UserService.getUserById(message.sender_id)
                    messages_with_users.push({
                        ...message,
                        sender: user
                    })
                }
                const members = await UserService.getUsersById(dialog.members_id);
                result.push({
                    ...dialog,
                    messages: messages_with_users,
                    members
                });
            }
            return res.status(200).send(result);
        } catch (err: any) {
            return res.status(400).json({message: err.message});
        }
    }

    async checkMessage (req: Request, res: Response, next: NextFunction) {
        try {
            const message = await MessageService.getMessageByIdAndUpdate(req.params.id, {checked: true});
            const dialog = await DialogService.getDialogById(message.dialog_id);
            const sender = await UserService.getUserById(message.sender_id);
            sendMessage(
                "check_message",
                {...message, sender},
                dialog.members_id
            )
            return res.status(200).send({...message, sender});
        } catch (err: any) {
            return res.status(404).send({message: err.message});
        }
    }

    async createMessage (req: Request, res: Response, next: NextFunction) {
        try {
            const token = checkToken(req.headers.authorization);
            const user = await UserService.getUserById(token);
            const dialog = await DialogService.getDialogById(req.body.dialog_id);
            const message = await MessageService.createMessage(user._id, dialog._id, req.body.text, req.body.image);
            sendMessage(
                "new_message",
                {...message.toObject(), sender: user},
                dialog.members_id.filter(id => id.toString() !== user._id.toString())
            )
            return res.status(201).json({...message.toObject(), sender: user});
        } catch (err: any) {
            return res.status(400).json({message: err.message});
        }
    }

    async createDialog (req: Request, res: Response, next: NextFunction) {
        try {
            const token = checkToken(req.headers.authorization);
            const user = await UserService.getUserById(token);
            const dialog = await DialogService.createDialog([user._id, ...req.body.members_id]);
            const messages = await MessageService.getMessagesByDialogId(dialog._id);
            let messages_with_users = [];
            for (const message of messages) {
                const user = await UserService.getUserById(message.sender_id)
                messages_with_users.push({
                    ...message,
                    sender: user
                })
            }
            const members = await UserService.getUsersById(dialog.members_id);
            const result = {
                ...dialog,
                messages: messages_with_users,
                members
            };
            sendMessage(
                "new_dialog",
                result,
                req.body.members_id
            )
            return res.status(200).send(result);

        } catch (err: any) {
            return res.status(404).json({message: err.message});
        }
    }
}

export default new MessageController()