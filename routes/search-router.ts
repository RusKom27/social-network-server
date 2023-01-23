import express from "express";
import {SearchController} from "../controllers";

const router = express.Router()

router.get('/', SearchController.search);

export default router