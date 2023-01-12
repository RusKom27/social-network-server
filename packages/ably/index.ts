import Ably from "ably/callbacks";

const realtime = new Ably.Realtime(process.env.ABLY_API_KEY || "");

const AblyChannels = {
    messages_channel: realtime.channels.get('messages'),
    posts_channel: realtime.channels.get('posts')
}

export default AblyChannels