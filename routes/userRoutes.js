const express = require("express");
const userController = require("../controller/userController");
const router = express.Router();

// Debug middleware to log requests to this router
router.use((req, res, next) => {
  console.log(`[UserRoutes] ${req.method} ${req.originalUrl} at ${new Date().toISOString()}`);
  next();
});

// Main login route
router.post("/user-login", userController.userLogin);
router.post("/userRegister",userController.userRegister);
router.post("/changePassword",userController.changePassword);
router.post("/forgotPassword",userController.forgotPassword);
router.post("/reset-password", userController.resetPassword);
router.put("/userUpdate", userController.userUpdate);
router.post("/saveOrder", userController.saveOrder);
router.post("/orderDashboard",userController.orderDashboard);
router.get("/updateOrderStatus",userController.updateOrderStatus);
router.post("/deleteOrder",userController.deleteOrder);


// Test route to verify the controller and database connection
router.get("/test-connection", userController.testConnection);

module.exports = router;