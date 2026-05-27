// src/routes/documentRoutes.js
const express = require("express");
const {
  getDocuments,
  getAlerts,
  createDocument,
  updateDocument,
  deleteDocument,
} = require("../controllers/documentController");
const { protect } = require("../middleware/authMiddleware");

// Router nested: /api/vehicles/:vehicleId/documents
const router = express.Router({ mergeParams: true });
router.use(protect);
router.get("/", getDocuments);
router.post("/", createDocument);

// Router root: /api/documents
const rootRouter = express.Router();
rootRouter.use(protect);
rootRouter.get("/alerts", getAlerts);
rootRouter.put("/:id", updateDocument);
rootRouter.delete("/:id", deleteDocument);

module.exports = router;
module.exports.rootRouter = rootRouter;
