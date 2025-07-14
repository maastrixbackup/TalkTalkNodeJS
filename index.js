const express = require("express");
const cors = require("cors");
const path = require("path");

const addressRoutes = require("./routes/addressRoutes");
const orderRoutes = require("./routes/orderRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
const statusRoutes = require("./routes/statusRoutes");
const userRoutes = require("./routes/userRoutes");
const authMiddleWare = require("./middlewares/validateAuth");

const app = express();

const PORT = process.env.port || 5000;

// Set static directory and middlewares
app.use(express.static(path.join(__dirname, "build")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Test route
// app.get("/health", (req, res) => {
//   res.send({ status: "success", message: "Service is running!" });
// });

app.use("/api/hi", (req, res, next) => {
  res.json({
    msg: "hello world",
  });
});

app.use("/api/addresses", authMiddleWare, addressRoutes);
app.use("/api/order", authMiddleWare, orderRoutes);
app.use("/api/orderstatus", authMiddleWare, statusRoutes); // Add this new line
app.use("/api/user", userRoutes);
app.use("/api/appointment", authMiddleWare, appointmentRoutes);


// Serve frontend files
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

// Error handling middleware
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    status: "error",
    message: err.response?.data.message || "Internal Server Error",
    errorDetails: err.response?.data || null,
    headers: err.response?.headers || null,
    err: err,
  });
});

// Catch-All Route for Undefined Endpoints
app.use((req, res) => {
  res.status(404).json({
    status: "error",
    message: "Route not found",
  });
});

// Start server
const startServer = () => {
  app.listen(PORT, () => {
    console.log(`Listening on port-${PORT}`);
  });
};

startServer();
