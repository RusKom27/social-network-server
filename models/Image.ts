import mongoose, {Schema, Types} from "mongoose";
import {IImage} from "../interfaces";

const ImageSchema: Schema = new Schema({
    name: {
        type: String,
        require: true,
    },
    fileId: {
        type: Types.ObjectId,
        required: true,
    },
    // image: {
    //     type: SchemaTypes.Buffer,
    // },
    contentType: {
        type: String,
    },
}, {timestamps: true});

export default mongoose.model<IImage>('Image', ImageSchema, 'images');