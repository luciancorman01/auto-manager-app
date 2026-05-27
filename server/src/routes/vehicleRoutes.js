// src/routes/vehicleRoutes.js
const express = require("express");
const router = express.Router();
const {
  getVehicles,
  getVehicleById,
  createVehicle,
  updateVehicle,
  deleteVehicle,
  uploadPhoto,
  deletePhoto,
  setPrimaryPhoto,
} = require("../controllers/vehicleController");
const { protect } = require("../middleware/authMiddleware");
const { uploadVehiclePhoto } = require("../middleware/uploadMiddleware");

router.use(protect); // toate rutele cer autentificare

router.get("/", getVehicles);
router.get("/:id", getVehicleById);
router.post("/", createVehicle);
router.put("/:id", updateVehicle);
router.delete("/:id", deleteVehicle);
router.post("/:id/photos", uploadVehiclePhoto.single("photo"), uploadPhoto);
router.delete("/:id/photos/:photoId", deletePhoto);
router.patch("/:id/photos/:photoId/primary", setPrimaryPhoto);

module.exports = router;
