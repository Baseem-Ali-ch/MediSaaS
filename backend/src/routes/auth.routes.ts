import { Router } from "express";
import * as authController from "../controllers/auth/auth.controller";

const router = Router();

router.post("/register-lab", authController.registerLab);
router.post('/login', authController.login)
router.get('/verify-email', authController.verifyEmail);
router.post('/resend-email-verification', authController.resendEmailVerificationToken);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);
router.post('/refresh-token', authController.refreshToken);

// router.get('/appointments', requirePermission('appointments:read'), appointmentController.list)


export default router;
