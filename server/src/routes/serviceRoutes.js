// src/routes/serviceRoutes.js
const express = require("express");
const router = express.Router({ mergeParams: true });
const {
  getServiceHistory,
  getServiceStats,
  createServiceEntry,
  updateServiceEntry,
  deleteServiceEntry,
} = require("../controllers/serviceController");
const { protect } = require("../middleware/authMiddleware");

router.use(protect);

// Nested sub /api/vehicles/:vehicleId/service
router.get("/", getServiceHistory);
router.get("/stats", getServiceStats);
router.post("/", createServiceEntry);

module.exports = router;

// Router separat pentru /api/service
const rootRouter = express.Router();
rootRouter.use(protect);
rootRouter.put("/:id", updateServiceEntry);
rootRouter.delete("/:id", deleteServiceEntry);

module.exports.rootRouter = rootRouter;
