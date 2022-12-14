const express = require('express')
const multer = require('multer');
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

router.post('/upload', upload.single('image'), async (req, res, next) => {
    console.log(req.file)
    res.status(200);
});

module.exports = router
