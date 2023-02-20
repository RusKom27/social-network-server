import {Document, Types} from "mongoose"

export default interface Topic extends Document {
    _id: Types.ObjectId;
    name: string;
    posts: Types.ObjectId[];
    count: number;
}