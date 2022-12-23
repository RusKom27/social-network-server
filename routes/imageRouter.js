const express = require('express')
const multer = require('multer');
const Image = require("../models/Image");

const router = express.Router()
const storage = multer.memoryStorage();
const upload = multer({ storage: storage })

router.post('/upload', upload.single('image'), async (req, res) => {
    try {
        const new_image = {
            name: req.file.originalname,
            image: new Buffer.from(req.file.buffer, 'base64'),
            contentType: req.file.mimetype,
        }
        Image.findOne({name: new_image.name}).then(image => {
            if (image) {
                image.image = new_image.image
                image.save()
                res.send(image)
            }
            else Image.create(new_image).then(image => res.send(image))
        })
    } catch (err) {
        res.json({message: err.message})
    }
});

router.get('/:filename', (req, res) => {
    try {
        Image.findOne({name: req.params.filename}).lean().then(item => {
            res.send(item);
        }).catch(reason => res.json({message: reason.message}));
    } catch (err) {
        res.status(500).json({message: err.message})
    }

});

module.exports = router
