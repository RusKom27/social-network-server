const User = require('../models/User')

const getUser = async (req, res, next) => {
    if (req.headers.authorization) {
        try {
            await User.findById(req.headers.authorization).then(
                async user => req.user = user
            ).catch(err => {
                return res.status(400).json({message: err.message})
            })
        } catch (err) {
            return res.status(500).json({message: err.message})
        }
    }
    next()
}

module.exports = getUser