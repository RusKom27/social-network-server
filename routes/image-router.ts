import express from "express";
import multer from "multer";
import {ImageController} from "../controllers";

const storage = multer.memoryStorage();
const upload = multer({ storage: storage })
const router = express.Router()

router.get('/', ImageController.getAll);
router.post('/upload', upload.single('image'), ImageController.upload);
router.get('/:filename', ImageController.getByFileName);

export default router
