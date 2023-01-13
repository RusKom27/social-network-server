import Image from "../models/Image";
import {Types} from "mongoose";

export default {
    getImage: async (file_name: string) => {
        const image = await Image.findOne({name: file_name}).lean().exec()
        if (!image) throw Error("Image not found")
        else return image
    },

    convertBufferToBase64: (buffer: ArrayBufferLike) => {
        return btoa(new Uint8Array(buffer)
            .reduce((data, byte) => data + String.fromCharCode(byte), '')
        )
    },

    createImage: async (name: string, buffer: Types.Buffer, contentType: string) => {
        const new_image = {
            name,
            image: buffer,
            contentType,
        }
        let image = await Image.findOne({name}).exec()
        if (image) {
            image.image = new_image.image;
            return await image.save()
        }
        return await Image.create(new_image)
    }
}