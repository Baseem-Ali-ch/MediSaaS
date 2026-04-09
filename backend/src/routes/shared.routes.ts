import { Router } from "express";
import { authenticate } from "../middlewares/authenticate";
import * as patientController from "../controllers/shared/patient.controller";
import * as testController from "../controllers/shared/test.controller";

const router = Router();

router.use(authenticate);

router.get("/patients", patientController.getPatients);
router.get("/patients/:id", patientController.getPatientById);
router.post("/patients", patientController.createPatient);
router.put("/patients/:id", patientController.updatePatient);
router.delete("/patients/:id", patientController.deletePatient);

router.get("/tests", testController.getTests);
router.get("/tests/:id", testController.getTestById);
router.post("/tests", testController.createTest);
router.put("/tests/:id", testController.updateTest);
router.delete("/tests/:id", testController.deleteTest);

export default router;
