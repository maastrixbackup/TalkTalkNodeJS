const express = require("express");
const statusController = require("../controller/statusController.js");
const router = express.Router();

router.get("/status-checker/:orderId", statusController.statusChecker);
router.post("/cancel-order/:orderId", statusController.cancelOrder);
router.get("/getCpwn", statusController.getCpwn);
router.get("/getServiceID", statusController.getServiceID);
router.patch("/editOrder/:orderId", statusController.editOrder);
router.patch("/editAppointment/:orderId", statusController.editAppointment);
router.post("/modifyCareLevel", statusController.modifyCareLevel);
router.post("/modifyIP", statusController.modifyIP);
router.post("/ceaseOrder",statusController.ceaseOrder);
module.exports = router;
