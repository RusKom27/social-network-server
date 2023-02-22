import {Document, Types} from "mongoose";

interface IToken extends Document {
    _id: Types.ObjectId,
    user_id: Types.ObjectId,
    refresh_token: string,
}

export default IToken;