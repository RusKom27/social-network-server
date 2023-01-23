import mongoose, {Schema} from "mongoose"
import {IToken} from "../interfaces";

const TokenSchema: Schema = new Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    refresh_token: {
        type: String,
        required: true
    }
})

export default mongoose.model<IToken>('Token', TokenSchema, 'tokens')