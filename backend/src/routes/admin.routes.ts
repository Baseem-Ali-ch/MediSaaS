import { Router } from "express";
import { authenticate } from "../middlewares/authenticate";
import * as profileController from "../controllers/admin/profile.controller";

const router = Router()

router.use(authenticate)

// router.get('/profile', requirePermission('profile:read'), profileController.getProfile)
router.get('/profile', profileController.getProfile)
router.patch('/profile', profileController.udpateProfile)
router.put('/profile/change-password', profileController.changePassword)

export default router