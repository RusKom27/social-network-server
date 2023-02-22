import {Document, Types} from "mongoose";

interface ITopic extends Document {
    _id: Types.ObjectId;
    name: string;
    posts: Types.ObjectId[];
    count: number;
    createdAt: Date;
    updatedAt: Date;
}

export default ITopic;