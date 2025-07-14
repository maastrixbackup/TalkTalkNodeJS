const express = require("express");
const addressController = require("../controller/addressController.js");
const router = express.Router();

router.get("/ping-server", addressController.pingServer);
router.post("/check-address", addressController.checkaddress);
router.post(
  "/get-all-product-availablity",
  addressController.productAvailablity
);
module.exports = router;
