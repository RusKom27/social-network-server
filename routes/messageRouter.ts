import {Request, Response, NextFunction} from "express";
import AblyChannels from "../packages/ably";
import express from "express";
import {checkToken} from "../helpers/validation";
import {DialogController, MessageController, UserController} from "../controllers";

const router = express.Router();

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = checkToken(req.headers.authorization);
        const user = await UserController.getUserById(token);
        const dialogs = await DialogController.getDialogsByMembersId([user._id]);
        let result = [];
        for (const dialog of dialogs) {
            const messages = await MessageController.getMessagesByDialogId(dialog._id);
            let messages_with_users = [];
            for (const message of messages) {
                const user = await UserController.getUserById(message.sender_id)
                messages_with_users.push({
                    ...message,
                    sender: user
                })
            }
            const members = await UserController.getUsersById(dialog.members_id);
            result.push({
                ...dialog,
                messages: messages_with_users,
                members
            });
        }
        res.status(200).send(result);
    } catch (err: any) {
        res.status(400).json({message: err.message});
    }
    next();
})

router.put('/check/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const message = await MessageController.getMessageByIdAndUpdate(req.params.id, {checked: true});
        const sender = await UserController.getUserById(message.sender_id);
        AblyChannels.messages_channel
            .publish(
                "check_message",
                {...message, sender}
            );
        res.status(200).send({...message, sender});
    } catch (err: any) {
        res.status(404).send({message: err.message});
    }
    next();
})

router.post('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = checkToken(req.headers.authorization);
        const user = await UserController.getUserById(token);
        const dialog = await DialogController.getDialogById(req.body.dialog_id);
        const message = await MessageController.createMessage(user._id, dialog._id, req.body.text, req.body.image);
        AblyChannels.messages_channel
            .publish(
                "new_message",
                {...message.toObject(), sender: user}
            );
        res.status(201).json({...message.toObject(), sender: user});

    } catch (err: any) {
        res.status(400).json({message: err.message});
    }
    next();
})

router.post('/create_dialog', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = checkToken(req.headers.authorization);
        const user = await UserController.getUserById(token);
        const dialog = await DialogController.createDialog([user._id, ...req.body.members_id]);
        const messages = await MessageController.getMessagesByDialogId(dialog._id);
        let messages_with_users = [];
        for (const message of messages) {
            const user = await UserController.getUserById(message.sender_id)
            messages_with_users.push({
                ...message,
                sender: user
            })
        }
        const members = await UserController.getUsersById(dialog.members_id);
        const result = {
            ...dialog,
            messages: messages_with_users,
            members
        };
        AblyChannels.messages_channel.publish("new_dialog", result);
        res.status(200).send(result);

    } catch (err: any) {
        res.status(404).json({message: err.message});
    }
})

export default router