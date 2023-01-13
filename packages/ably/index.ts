import Ably from "ably/callbacks";

const realtime = new Ably.Realtime(process.env.ABLY_API_KEY || "");


let AblyChannels: any = {
    messages_channel: realtime.channels.get('messages'),
    posts_channel: realtime.channels.get('posts')
}

export const sendMessage = (message_name: string, data: any, receivers: string[]) => {
    for (const receiver of receivers) {
        if (!AblyChannels.hasOwnProperty(receiver)) continue
        AblyChannels[receiver].publish(
            message_name,
            data
        );
    }
}

export const addChannel = (user_id: string) => {
    AblyChannels[user_id] = realtime.channels.get(user_id)
    console.log(realtime.channels)
}

export const removeChannel = (user_id: string) => {
    if (AblyChannels.hasOwnProperty(user_id)) delete AblyChannels[user_id]
    console.log(realtime.channels)
}

export default AblyChannels