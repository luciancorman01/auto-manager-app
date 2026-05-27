// src/app.js
const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const vehicleRoutes = require("./routes/vehicleRoutes");
const documentRoutes = require("./routes/documentRoutes");
const serviceRoutes = require("./routes/serviceRoutes");

const app = express();

// Middleware
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/vehicles", vehicleRoutes);

// Nested routes: /api/vehicles/:vehicleId/documents
app.use("/api/vehicles/:vehicleId/documents", documentRoutes);
// Nested routes: /api/vehicles/:vehicleId/service
app.use("/api/vehicles/:vehicleId/service", serviceRoutes);

// Root document/service routes (update & delete)
app.use("/api/documents", documentRoutes.rootRouter);
app.use("/api/service", serviceRoutes.rootRouter);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "AutoCare Manager API funcționează!" });
});

// 404
app.use((req, res) => {
  res.status(404).json({ message: "Ruta nu există." });
});

module.exports = app;
