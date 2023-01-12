import {Request, Response, NextFunction} from "express";
import {Types} from "mongoose";
import express from "express";
import Image from "../models/Image";
import multer from "multer";

const storage = multer.memoryStorage();
const upload = multer({ storage: storage })
const router = express.Router()

router.post('/upload', upload.single('image'), async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.file) return res.status(404).send({message: "File not found"})

        // const base64Buffer = btoa(
        //     new Uint8Array(req.file.buffer)
        //         .reduce((data, byte) => data + String.fromCharCode(byte), '')
        // )

        const new_image = {
            name: req.file.originalname,
            image: new Types.Buffer(req.file.buffer),
            contentType: req.file.mimetype,
        }

        let image = await Image.findOne({name: req.file.originalname}).exec()

        if (image) {
            image.image = new_image.image;
            await image.save()
            return res.status(200).send(image)
        }

        const created_image = await Image.create(new_image)
        res.status(200).send(created_image)
    } catch (err: any) {
        res.json({message: err.message})
    }
    next()
});

router.get('/:filename', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const image = await Image.findOne({name: req.params.filename}).lean().exec()
        if (!image) return res.status(404).send({message: "Image not found"})
        const base64Buffer = btoa(
                new Uint8Array(image.image.buffer)
                    .reduce((data, byte) => data + String.fromCharCode(byte), '')
            )
        res.send({
            ...image,
            image: base64Buffer
        })
    } catch (err: any) {
        res.status(500).json({message: err.message})
    }
    next()
});

export default router
