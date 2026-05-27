// src/controllers/documentController.js
const prisma = require("../config/prisma");

// Helper: verifică dacă mașina aparține userului
const verifyVehicleOwnership = async (vehicleId, userId) => {
  const vehicle = await prisma.vehicle.findFirst({
    where: { id: Number(vehicleId), user_id: userId },
  });
  return !!vehicle;
};

// GET /api/vehicles/:vehicleId/documents
const getDocuments = async (req, res) => {
  const { vehicleId } = req.params;

  try {
    const owns = await verifyVehicleOwnership(vehicleId, req.user.id);
    if (!owns) return res.status(403).json({ message: "Acces interzis." });

    const documents = await prisma.document.findMany({
      where: { vehicle_id: Number(vehicleId) },
      orderBy: { data_expirare: "asc" },
    });

    // Adaugă status alert pentru fiecare document
    const today = new Date();
    const withStatus = documents.map((doc) => {
      const daysLeft = Math.ceil((new Date(doc.data_expirare) - today) / (1000 * 60 * 60 * 24));
      let status = "green";
      if (daysLeft < 0) status = "red";
      else if (daysLeft <= 30) status = "yellow";

      return { ...doc, zile_ramase: daysLeft, status };
    });

    res.json(withStatus);
  } catch (err) {
    res.status(500).json({ message: "Eroare server.", error: err.message });
  }
};

// GET /api/documents/alerts — toate documentele aproape de expirare ale userului
const getAlerts = async (req, res) => {
  try {
    const today = new Date();
    const in30Days = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);

    const documents = await prisma.document.findMany({
      where: {
        vehicle: { user_id: req.user.id },
        data_expirare: { lte: in30Days },
      },
      include: { vehicle: { select: { marca: true, model: true, nr_inmatriculare: true } } },
      orderBy: { data_expirare: "asc" },
    });

    const withStatus = documents.map((doc) => {
      const daysLeft = Math.ceil((new Date(doc.data_expirare) - today) / (1000 * 60 * 60 * 24));
      return { ...doc, zile_ramase: daysLeft, status: daysLeft < 0 ? "red" : "yellow" };
    });

    res.json(withStatus);
  } catch (err) {
    res.status(500).json({ message: "Eroare server.", error: err.message });
  }
};

// POST /api/vehicles/:vehicleId/documents
const createDocument = async (req, res) => {
  const { vehicleId } = req.params;
  const { tip, data_expirare, pret_platit, companie } = req.body;

  if (!tip || !data_expirare) {
    return res.status(400).json({ message: "Tipul și data expirării sunt obligatorii." });
  }

  // Validare tip document
  const VALID_TYPES = ["RCA", "ITP", "Rovinieta"];
  if (!VALID_TYPES.includes(tip)) {
    return res.status(400).json({ message: `Tipul documentului trebuie să fie unul din: ${VALID_TYPES.join(", ")}.` });
  }

  // Validare dată expirare
  const expDate = new Date(data_expirare);
  if (isNaN(expDate.getTime())) {
    return res.status(400).json({ message: "Data expirării nu este validă." });
  }

  // Validare pret_platit dacă e trimis
  if (pret_platit !== undefined && pret_platit !== null && pret_platit !== "") {
    const pret = Number(pret_platit);
    if (isNaN(pret) || pret < 0) {
      return res.status(400).json({ message: "Prețul plătit trebuie să fie un număr pozitiv." });
    }
  }

  try {
    const owns = await verifyVehicleOwnership(vehicleId, req.user.id);
    if (!owns) return res.status(403).json({ message: "Acces interzis." });

    const document = await prisma.document.create({
      data: {
        vehicle_id: Number(vehicleId),
        tip,
        data_expirare: expDate,
        pret_platit: (pret_platit !== undefined && pret_platit !== null && pret_platit !== "") ? Number(pret_platit) : null,
        companie: companie || null,
      },
    });

    res.status(201).json({ message: "Document adăugat!", document });
  } catch (err) {
    res.status(500).json({ message: "Eroare server.", error: err.message });
  }
};

// PUT /api/documents/:id
const updateDocument = async (req, res) => {
  const { tip, data_expirare, pret_platit, companie } = req.body;

  // Validare tip dacă e trimis
  if (tip !== undefined) {
    const VALID_TYPES = ["RCA", "ITP", "Rovinieta"];
    if (!VALID_TYPES.includes(tip)) {
      return res.status(400).json({ message: `Tipul documentului trebuie să fie unul din: ${VALID_TYPES.join(", ")}.` });
    }
  }

  // Validare dată dacă e trimisă
  if (data_expirare !== undefined) {
    const expDate = new Date(data_expirare);
    if (isNaN(expDate.getTime())) {
      return res.status(400).json({ message: "Data expirării nu este validă." });
    }
  }

  // Validare pret dacă e trimis
  if (pret_platit !== undefined && pret_platit !== null && pret_platit !== "") {
    const pret = Number(pret_platit);
    if (isNaN(pret) || pret < 0) {
      return res.status(400).json({ message: "Prețul plătit trebuie să fie un număr pozitiv." });
    }
  }

  try {
    const document = await prisma.document.findFirst({
      where: { id: Number(req.params.id) },
      include: { vehicle: true },
    });

    if (!document || document.vehicle.user_id !== req.user.id) {
      return res.status(404).json({ message: "Documentul nu a fost găsit." });
    }

    const data = {};
    if (tip !== undefined) data.tip = tip;
    if (data_expirare !== undefined) data.data_expirare = new Date(data_expirare);
    if (pret_platit !== undefined) data.pret_platit = (pret_platit !== null && pret_platit !== "") ? Number(pret_platit) : null;
    if (companie !== undefined) data.companie = companie;

    const updated = await prisma.document.update({
      where: { id: Number(req.params.id) },
      data,
    });

    res.json({ message: "Document actualizat!", document: updated });
  } catch (err) {
    res.status(500).json({ message: "Eroare server.", error: err.message });
  }
};

// DELETE /api/documents/:id
const deleteDocument = async (req, res) => {
  try {
    const document = await prisma.document.findFirst({
      where: { id: Number(req.params.id) },
      include: { vehicle: true },
    });

    if (!document || document.vehicle.user_id !== req.user.id) {
      return res.status(404).json({ message: "Documentul nu a fost găsit." });
    }

    await prisma.document.delete({ where: { id: Number(req.params.id) } });

    res.json({ message: "Document șters." });
  } catch (err) {
    res.status(500).json({ message: "Eroare server.", error: err.message });
  }
};

module.exports = { getDocuments, getAlerts, createDocument, updateDocument, deleteDocument };
