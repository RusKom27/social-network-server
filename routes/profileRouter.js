const express = require('express')
const router = express.Router()

router.get('/', (req, res, next) => {
    res.send("Profile")
})

router.get('/:id', (req, res, next) => {
    res.send(req.params.id)
})


module.exports = router