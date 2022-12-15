const express = require('express')
const multer = require('multer');
const User = require("../models/User");
const path = require("path");
const router = express.Router()

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(process.cwd(), 'tmp/images'))
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})

const upload = multer({ storage: storage })

router.post('/upload', async (req, res, next) => {
    res.json(path.join(process.cwd(), 'public/images'))

});

module.exports = router
