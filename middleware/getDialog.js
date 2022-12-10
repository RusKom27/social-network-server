const Dialog = require('../models/Dialog')

const getDialog = async (req, res, next) => {
    if (req.body.dialog_id) {
        try {
            await Dialog.findById(req.body.dialog_id).then(
                async dialog => req.dialog = dialog
            ).catch(err => {
                return res.status(400).json({message: err.message})
            })
        } catch (err) {
            return res.status(500).json({message: err.message})
        }
    }
    next()
}

module.exports = getDialog