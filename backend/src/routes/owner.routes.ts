import { Router } from "express";
import { authenticate } from "../middlewares/authenticate";
import * as profileController from "../controllers/owner/profile.controller";
import * as labController from "../controllers/owner/lab.controller";
import * as branchController from "../controllers/owner/branch.controller";
import * as staffController from '../controllers/owner/staff.controller'

const router = Router()

router.use(authenticate)

// router.get('/profile', requirePermission('profile:read'), profileController.getProfile)
router.get('/profile', profileController.getProfile)
router.patch('/profile', profileController.udpateProfile)
router.put('/profile/change-password', profileController.changePassword)

router.get('/lab', labController.getLab)
router.patch('/lab/:id', labController.updateLab)

router.get('/branch', branchController.getBranch)
router.post('/branch', branchController.createBranch)
router.patch('/branch/:id', branchController.udpateBranch)
router.delete('/branch/:id', branchController.deleteBranch) 

router.get("/staff", staffController.getStaff);
router.post("/staff", staffController.createStaff);
router.put("/staff/:id", staffController.updateStaff);
router.delete("/staff/:id", staffController.deleteStaff);

export default router