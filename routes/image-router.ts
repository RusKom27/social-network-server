import express from "express";
import multer from "multer";
import {ImageController} from "../controllers";
import {GridFsStorage} from "multer-gridfs-storage";
import config from "../config/config";

const storage = new GridFsStorage({
    url: config.mongo_url,
    file: (req, file) => {
        return new Promise((resolve) => {
            const fileInfo = {
                filename: file.originalname,
                bucketName: "uploads",
            };
            resolve(fileInfo);
        });
    },
});

storage.on('connection', () => {
    console.log('Connected to GridFS');
});

storage.on('error', (error) => {
    console.log('Error connecting to GridFS:', error);
});


const upload = multer({ storage: storage });
const router = express.Router();

router.get('/', ImageController.getAll);
router.post('/upload', upload.single('image'), ImageController.upload);
router.get('/:filename', ImageController.getByFileName);

export default router;
