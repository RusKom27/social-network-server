import express from "express";
import UserController from "../controllers/user-controller";

const router = express.Router()

router.get('/', UserController.getByToken)
router.get('/login/:login', UserController.getByLogin)
router.get('/id/:id', UserController.getById)
router.get('/id_array', UserController.getByIdArray)
router.post('/create', UserController.createUser)
router.post('/login', UserController.login)
router.delete('/close_connection', UserController.closeConnection)
router.post('/update', UserController.updateUser)
router.put('/subscribe/:user_login', UserController.subscribeUser)

export default router