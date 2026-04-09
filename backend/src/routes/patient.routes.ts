import { Router } from "express";
import { authenticate } from "../middlewares/authenticate";
import * as patientController from "../controllers/shared/patient.controller";

const router = Router();

router.use(authenticate);

router.get("/", patientController.getPatients);
router.get("/:id", patientController.getPatientById);
router.post("/", patientController.createPatient);
router.put("/:id", patientController.updatePatient);
router.delete("/:id", patientController.deletePatient);

export default router;
