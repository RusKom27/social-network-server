import Ably from "ably/callbacks";
import {Types} from "mongoose";

const realtime = new Ably.Realtime(process.env.ABLY_API_KEY || "");


let AblyChannels: any = {
    messages_channel: realtime.channels.get('messages'),
    posts_channel: realtime.channels.get('posts')
}

export const sendMessage = (message_name: string, data: any, receivers: Types.ObjectId[] | string[]) => {
    for (const receiver of receivers) {
        if (!AblyChannels.hasOwnProperty(receiver.toString())) continue
        AblyChannels[receiver.toString()].publish(
            message_name,
            data
        );
    }
}

export const addChannel = (user_id: Types.ObjectId | string) => {
    AblyChannels[user_id.toString()] = realtime.channels.get(user_id.toString())
    console.log(Object.keys(AblyChannels))
}

export const removeChannel = (user_id: Types.ObjectId | string) => {
    if (AblyChannels.hasOwnProperty(user_id.toString())) delete AblyChannels[user_id.toString()]
    console.log(Object.keys(AblyChannels))
}

export default AblyChannels