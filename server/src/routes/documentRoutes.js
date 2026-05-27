// src/routes/documentRoutes.js
const express = require("express");
const router = express.Router({ mergeParams: true }); // mergeParams pentru vehicleId din parent
const {
  getDocuments,
  getAlerts,
  createDocument,
  updateDocument,
  deleteDocument,
} = require("../controllers/documentController");
const { protect } = require("../middleware/authMiddleware");

router.use(protect);

// Nested sub /api/vehicles/:vehicleId/documents
router.get("/", getDocuments);
router.post("/", createDocument);

module.exports = router;

// Router separat pentru /api/documents
const rootRouter = express.Router();
rootRouter.use(protect);
rootRouter.get("/alerts", getAlerts);
rootRouter.put("/:id", updateDocument);
rootRouter.delete("/:id", deleteDocument);

module.exports.rootRouter = rootRouter;
