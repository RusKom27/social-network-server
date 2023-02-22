import mongoose, {Types} from "mongoose";
import {GridFSBucket, GridFSFile} from "mongodb";
import {NextFunction, Request, Response} from "express";
import {getFile} from "../helpers/validation";
import {ImageService} from "../service";

const conn = mongoose.connection;
let gfs: GridFSBucket;

mongoose.connection.once('open', () => {
    gfs = new mongoose.mongo.GridFSBucket(conn.db, {
        bucketName: "uploads",
    });
});

class ImageController {
    async upload(req: Request, res: Response, next: NextFunction) {
        try {
            const file = getFile(req.file) as any;

            const image = await ImageService.createImage(
                file.originalname,
                file.mimetype,
                file.id,
            );
            return res.status(200).send(image);

        } catch (err: any) {
            next(err);
        }
    }

    async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const images = await ImageService.getImages();
            return res.status(200).send({
                images,
            });
        } catch (err: any) {
            next(err);
        }
    }

    async getByFileName(req: Request, res: Response, next: NextFunction) {
        try {
            const files = await gfs.find({filename: req.params.filename}).toArray();
            return gfs
                .openDownloadStreamByName(files.length > 0 ? req.params.filename : "default_image.png")
                .pipe(res);
        } catch (err: any) {
            next(err);
        }
    }
}

export default new ImageController();