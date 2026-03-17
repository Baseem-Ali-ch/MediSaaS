import { Router } from "express";
import * as authController from "../../controllers/auth/auth.controller";

const router = Router();

router.post("/register-lab", authController.registerLab);
router.get('/verify-email', authController.verifyEmail);
router.post('/refresh-token', authController.refreshToken);

export default router;
