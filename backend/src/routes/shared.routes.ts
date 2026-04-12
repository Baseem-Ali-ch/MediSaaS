import { Router } from "express";
import { authenticate } from "../middlewares/authenticate";
import * as patientController from "../controllers/shared/patient.controller";
import * as testController from "../controllers/shared/test.controller";
import * as bookingController from "../controllers/shared/booking.controller";
import * as reportController from "../controllers/shared/report.controller";

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

router.get("/bookings", bookingController.getBookings);
router.post("/bookings", bookingController.createBooking);
router.put("/bookings/:id", bookingController.updateBooking);
router.delete("/bookings/:id", bookingController.cancelBooking);

router.get("/reports", reportController.getReports);
router.get("/reports/:id", reportController.getReportById);
router.post("/reports", reportController.createReport);
router.put("/reports/:id", reportController.updateReport);
router.delete("/reports/:id", reportController.deleteReport);

export default router;
