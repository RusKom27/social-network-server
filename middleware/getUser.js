const User = require('../models/User')

const getUser = async (req, res, next) => {
    if (req.body.user_id) {
        try {
            User.findById(req.body.user_id).then(
                user => res.user = user
            ).catch(reason => {
                return res.status(400).json({message: reason.message})
            })
        } catch (err) {
            return res.status(500).json({message: err.message})
        }
    }
    next()
}

module.exports = getUser