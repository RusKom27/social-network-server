const express = require('express')
const multer = require('multer');
const User = require("../models/User");
const Image = require("../models/Image");
const path = require("path");
const fs = require('fs');

const router = express.Router()
const storage = multer.memoryStorage();
const upload = multer({ storage: storage })

router.post('/upload', upload.single('image'), async (req, res, next) => {
    try {
        const image = {
            name: req.file.originalname,
            image: new Buffer.from(req.file.buffer, 'base64'),
            contentType: req.file.mimetype,
        }
        Image.create(image).then(image => {
            res.send(image)
        })
    } catch (err) {
        res.json({message: err.message})
    }
});

router.get('/:filename', (req, res) => {
    try {
        Image.findOne({name: req.params.filename}).then(item => {
            res.send({
                ...item._doc,
                image: item.image.toBSON()
            });
        }).catch(reason => res.json({message: reason.message}));
    } catch (err) {
        res.json({message: err.message})
    }

});

module.exports = router
