import {Image} from "../models";
import {Types} from "mongoose";
import ApiError from "../exeptions/api-error";
import {bufferToImageSource} from "../helpers/misc";

class ImageService {
    async getImage(file_name: string) {
        const image = await Image.findOne({name: file_name}).lean().exec()
        if (!image) throw ApiError.BadRequest("Image not found")
        else {
            return {
                ...image,
                src: bufferToImageSource(image.image.toString("base64"), image.contentType)
            }
        }
    }

    async getImages() {
        const images = await Image.find().lean().exec()

        return images.map(image => ({
            ...image,
            src: bufferToImageSource(image.image.toString("base64"), image.contentType)
        }))
    }

    async createImage(name: string, buffer: Types.Buffer, contentType: string) {
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
        const created_image = await Image.create(new_image)
        return {
            ...created_image,
            src: bufferToImageSource(created_image.image.toString("base64"), created_image.contentType)
        }
    }
}

export default new ImageService()