import {Types} from "mongoose";
import {NextFunction, Request, Response} from "express";
import {checkFile} from "../helpers/validation";
import {ImageService} from "../service";
import {convertBufferToBase64} from "../helpers/misc";

class ImageController {
    async upload(req: Request, res: Response, next: NextFunction) {
        try {
            const file = checkFile(req.file)
            let image = await ImageService.createImage(file.originalname, new Types.Buffer(file.buffer), file.mimetype)
            return res.status(200).send({
                ...image,
                image: convertBufferToBase64(image.image.buffer)
            })

        } catch (err: any) {
            next(err)
        }
    }

    async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const images = await ImageService.getImages()
            return res.status(200).send({
                images
            })
        } catch (err: any) {
            next(err)
        }
    }

    async getByFileName(req: Request, res: Response, next: NextFunction) {
        try {
            const image = await ImageService.getImage(req.params.filename)
            return res.status(200).send({
                ...image,
                image: convertBufferToBase64(image.image.buffer)
            })
        } catch (err: any) {
            next(err)
        }
    }
}

export default new ImageController()