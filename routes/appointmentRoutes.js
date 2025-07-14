const express = require("express");
const appointmentController = require("../controller/appointmentController.js");
const router = express.Router();

router.get("/ping-server", appointmentController.pingServer);
router.post("/reserve-appointment", appointmentController.reserveAppointment);
router.post("/get-appointment", appointmentController.getAppointments);
module.exports = router;
