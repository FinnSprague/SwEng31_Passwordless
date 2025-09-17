
const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const passkeyController = require("../controllers/passkeyController");
const magicKeyController = require("../controllers/magicKeyController");
const appointmentController = require("../controllers/appointmentController");
const userProfileController = require("../controllers/userProfileController");
const patientController = require("../controllers/patientController");

const { authenticate, authoriseRole } = require("../config/middleware");

router.get("/generate-magic-link", magicKeyController.generateMagicLink);
router.get("/magic-link", magicKeyController.handleMagicLink);
router.get("/register", authController.register);
router.post("/verify-reg", authController.verifyRegistration);
router.get("/authentication", authController.authentication);
router.post("/verify-auth", authController.verifyAuthentication);
router.get("/passkey-status", passkeyController.getPasskeyStatus);
router.get("/check-auth", authController.checkAuth);

router.post("/logout", authController.logout);

// Protected Routes
router.post("/create-appointment", authenticate, authoriseRole(["doctor"]), appointmentController.createAppointment);
router.get("/get-appointments", authenticate, appointmentController.getAppointments);
router.patch("/update-profile", authenticate, userProfileController.updateProfile);
router.delete("/delete-passkey/:passkeyId", authenticate, passkeyController.deletePasskey);
router.get("/get-passkeys", authenticate, passkeyController.getPasskeys);
router.get("/check-auth", authController.checkAuth);

router.post("/logout", authController.logout);

// Protected Routes
//router.post("/create-appointment", authenticate, authoriseRole(["doctor"]), appointmentController.createAppointment);
//router.get("/get-appointments", authenticate, appointmentController.getAppointments);
//router.patch("/update-profile", authenticate, userProfileController.updateProfile);
router.get("/get-profile", authenticate, userProfileController.getProfile);
//router.delete("/delete-passkey/:passkeyId", authenticate, authController.deletePasskey);

//Patient routes

router.post("/add-patient", patientController.addPatient);
router.get("/get-patients", patientController.getPatients);


module.exports = router;
