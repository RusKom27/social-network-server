import {DialogController} from "../controllers";
import router from "./auth-router";
import {authMiddleware} from "../middlewares";

router.get('/all', authMiddleware, DialogController.getDialogs);
router.post('/create', authMiddleware, DialogController.createDialog);

export default router;