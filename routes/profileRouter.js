const express = require('express')
const router = express.Router()

router.get('/', (req, res, next) => {
    res.send("ProfileGET")
})

router.post('/', (req, res, next) => {
    res.send("ProfilePOST")
})

module.exports = router