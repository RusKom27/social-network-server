import mongoose, {Schema, SchemaTypes} from "mongoose"
import IImage from "../interfaces/Image";

const ImageSchema: Schema = new Schema({
    name: {
        type: String,
        require: true
    },
    image: {
        type: SchemaTypes.Buffer,
    },
    contentType: {
        type: String
    }
}, {timestamps: true});

export default mongoose.model<IImage>('Image', ImageSchema, 'images')