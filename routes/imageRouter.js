const express = require('express')
const multer = require('multer');
const User = require("../models/User");
const path = require("path");
const router = express.Router()

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(process.cwd(), 'public/images'))
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})

const upload = multer({ storage: storage })

router.post('/upload',upload.single('image'), async (req, res, next) => {
    try {
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
            res.json(user)
        })
    } catch (err) {
        res.json({message: err.message})
    }
});

module.exports = router
