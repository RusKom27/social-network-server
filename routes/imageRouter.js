const express = require('express')
const multer = require('multer');
const User = require("../models/User");
const router = express.Router()

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})

const upload = multer({ storage: storage })

router.post('/upload',upload.single('image'), async (req, res, next) => {
    User.findByIdAndUpdate(
        req.headers.authorization,
        {
            images: {
                avatar_image: {
                    big: req.file.filename,
                    small: req.file.filename
                }
            }
        }).then(user => {
            console.log(user)
            res.json(user)
    })
    res.status(200);
});

module.exports = router
