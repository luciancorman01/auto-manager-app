// src/routes/serviceRoutes.js
const express = require("express");
const {
  getServiceHistory,
  getServiceStats,
  createServiceEntry,
  updateServiceEntry,
  deleteServiceEntry,
} = require("../controllers/serviceController");
const { protect } = require("../middleware/authMiddleware");

// Router nested: /api/vehicles/:vehicleId/service
const router = express.Router({ mergeParams: true });
router.use(protect);
router.get("/", getServiceHistory);
router.get("/stats", getServiceStats);
router.post("/", createServiceEntry);

// Router root: /api/service
const rootRouter = express.Router();
rootRouter.use(protect);
rootRouter.put("/:id", updateServiceEntry);
rootRouter.delete("/:id", deleteServiceEntry);

module.exports = router;
module.exports.rootRouter = rootRouter;
