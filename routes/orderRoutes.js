const express = require("express");
const orderController = require("../controller/orderController.js");
const router = express.Router();

router.get("/ping-server", orderController.pingServer);
router.post("/create-order", orderController.createOrder);
router.post("/product-suspend-full", orderController.suspendFull);
router.post("/product-unsuspend", orderController.unsuspendProduct);
// router.post("/get-all-product-availablity", orderController.productAvailablity);
module.exports = router;
