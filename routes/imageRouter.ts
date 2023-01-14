import {Request, Response, NextFunction} from "express";
import {Types} from "mongoose";
import express from "express";
import multer from "multer";
import {ImageController} from "../controllers";
import {checkFile} from "../helpers/validation";

const storage = multer.memoryStorage();
const upload = multer({ storage: storage })
const router = express.Router()

router.post('/upload', upload.single('image'), async (req: Request, res: Response, next: NextFunction) => {
    try {
        const file = checkFile(req.file)
        let image = await ImageController.createImage(file.originalname, new Types.Buffer(file.buffer), file.mimetype)
        res.status(200).send({
            ...image,
            image: ImageController.convertBufferToBase64(image.image.buffer)
        })

    } catch (err: any) {
        res.status(404).send({message: err.message})
    }
});

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const images = await ImageController.getImages()
        res.status(200).send({
            images
        })
    } catch (err: any) {
        res.status(404).send({message: err.message})
    }
});

router.get('/:filename', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const image = await ImageController.getImage(req.params.filename)
        res.status(200).send({
            ...image,
            image: ImageController.convertBufferToBase64(image.image.buffer)
        })
    } catch (err: any) {
        res.status(404).send({message: err.message})
    }
});

export default router
