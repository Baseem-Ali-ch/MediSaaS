import { Router } from "express";
import authRoutes from "./auth.routes";
import ownerRoutes from "./owner.routes";
import sharedRoutes from "./shared.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/owner", ownerRoutes);
router.use("/shared", sharedRoutes);

export default router;
