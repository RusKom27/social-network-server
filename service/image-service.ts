import {Image} from "../models";
import {Types} from "mongoose";
import ApiError from "../exeptions/api-error";

class ImageService {
    async getImage(file_name: string) {
        const image = await Image.findOne({name: file_name}).lean().exec()
        if (!image) throw ApiError.BadRequest("Image not found")
        else return image
    }

    async getImages() {
        return await Image.find().lean().exec()
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
        return await Image.create(new_image)
    }
}

export default new ImageService()