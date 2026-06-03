// src/controllers/vehicleController.js
const prisma = require("../config/prisma");

const VIN_REGEX = /^[A-HJ-NPR-Z0-9]{17}$/i;
const NR_INMATRICULARE_REGEX = /^[A-Z]{1,2}\s?\d{2,3}\s?[A-Z]{2,3}$/i;
const CURRENT_YEAR = new Date().getFullYear();

const BLOCKED_NR = ["BOU", "BOY", "JEG", "JAF", "CUR", "PIZ", "MUE", "GAY"];

function validateNrInmatriculare(nr) {
  const normalized = nr.replace(/\s/g, "").toUpperCase();
  if (!NR_INMATRICULARE_REGEX.test(nr.trim())) {
    return "Numărul de înmatriculare nu este valid (ex: BH 01 ABC).";
  }
  if (normalized.includes("Q")) {
    return "Numărul de înmatriculare nu poate conține litera Q.";
  }
  if (/^[IO]/.test(normalized)) {
    return "Numărul de înmatriculare nu poate începe cu litera I sau O.";
  }
  if (/III|OOO/.test(normalized)) {
    return "Numărul de înmatriculare nu poate conține combinații precum III sau OOO.";
  }
  const blocked = BLOCKED_NR.find((w) => normalized.includes(w));
  if (blocked) {
    return `Numărul de înmatriculare conține o combinație nepermisă (${blocked}).`;
  }
  return null;
}

// GET /api/vehicles
const getVehicles = async (req, res) => {
  try {
    const vehicles = await prisma.vehicle.findMany({
      where: { user_id: req.user.id },
      include: {
        documents: true,
        serviceHistory: { orderBy: { data: "desc" }, take: 1 },
      },
      orderBy: { createdAt: "desc" },
    });
    res.json(vehicles);
  } catch (err) {
    res.status(500).json({ message: "Eroare server.", error: err.message });
  }
};

// GET /api/vehicles/:id
const getVehicleById = async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ message: "ID vehicul invalid." });
  }
  try {
    const vehicle = await prisma.vehicle.findFirst({
      where: { id, user_id: req.user.id },
      include: {
        documents: { orderBy: { data_expirare: "asc" } },
        serviceHistory: { orderBy: { data: "desc" } },
      },
    });
    if (!vehicle)
      return res.status(404).json({ message: "Mașina nu a fost găsită." });
    res.json(vehicle);
  } catch (err) {
    res.status(500).json({ message: "Eroare server.", error: err.message });
  }
};

// POST /api/vehicles
const createVehicle = async (req, res) => {
  const { marca, model, nr_inmatriculare, vin, an_fabricatie, poza } = req.body;

  if (!marca || !model || !nr_inmatriculare || !vin || !an_fabricatie) {
    return res
      .status(400)
      .json({ message: "Toate câmpurile sunt obligatorii." });
  }

  const vinTrimmed = String(vin).trim().toUpperCase();
  if (!VIN_REGEX.test(vinTrimmed)) {
    return res.status(400).json({
      message: "VIN-ul trebuie să aibă exact 17 caractere alfanumerice valide.",
    });
  }

  const nrTrimmed = String(nr_inmatriculare).trim().toUpperCase();
  const nrError = validateNrInmatriculare(nrTrimmed);
  if (nrError) return res.status(400).json({ message: nrError });

  const an = Number(an_fabricatie);
  if (!Number.isInteger(an) || an < 1900 || an > CURRENT_YEAR) {
    return res.status(400).json({
      message: `Anul de fabricație trebuie să fie între 1900 și ${CURRENT_YEAR}.`,
    });
  }

  if (String(marca).trim().length < 2 || String(marca).trim().length > 50) {
    return res
      .status(400)
      .json({ message: "Marca trebuie să aibă între 2 și 50 de caractere." });
  }
  if (String(model).trim().length < 1 || String(model).trim().length > 50) {
    return res
      .status(400)
      .json({ message: "Modelul trebuie să aibă între 1 și 50 de caractere." });
  }

  if (poza !== undefined && poza !== null && poza !== "") {
    if (typeof poza !== "string" || !poza.startsWith("data:image/")) {
      return res
        .status(400)
        .json({ message: "Formatul imaginii nu este valid." });
    }
    if (poza.length > 7_000_000) {
      return res
        .status(400)
        .json({ message: "Imaginea este prea mare. Maxim 5MB." });
    }
  }

  try {
    const vehicle = await prisma.vehicle.create({
      data: {
        user_id: req.user.id,
        marca: String(marca).trim(),
        model: String(model).trim(),
        nr_inmatriculare: nrTrimmed,
        vin: vinTrimmed,
        an_fabricatie: an,
        poza: poza && poza !== "" ? poza : null,
      },
    });
    res.status(201).json({ message: "Mașina a fost adăugată!", vehicle });
  } catch (err) {
    if (err.code === "P2002") {
      return res.status(409).json({ message: "VIN-ul există deja în sistem." });
    }
    res.status(500).json({ message: "Eroare server.", error: err.message });
  }
};

// PUT /api/vehicles/:id
const updateVehicle = async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ message: "ID vehicul invalid." });
  }

  const { marca, model, nr_inmatriculare, vin, an_fabricatie, poza } = req.body;

  if (vin !== undefined) {
    const vinTrimmed = String(vin).trim().toUpperCase();
    if (!VIN_REGEX.test(vinTrimmed)) {
      return res.status(400).json({
        message:
          "VIN-ul trebuie să aibă exact 17 caractere alfanumerice valide.",
      });
    }
  }

  if (nr_inmatriculare !== undefined) {
    const nrTrimmed = String(nr_inmatriculare).trim().toUpperCase();
    const nrError = validateNrInmatriculare(nrTrimmed);
    if (nrError) return res.status(400).json({ message: nrError });
  }

  if (an_fabricatie !== undefined) {
    const an = Number(an_fabricatie);
    if (!Number.isInteger(an) || an < 1900 || an > CURRENT_YEAR) {
      return res.status(400).json({
        message: `Anul de fabricație trebuie să fie între 1900 și ${CURRENT_YEAR}.`,
      });
    }
  }

  if (poza !== undefined && poza !== null && poza !== "") {
    if (typeof poza !== "string" || !poza.startsWith("data:image/")) {
      return res
        .status(400)
        .json({ message: "Formatul imaginii nu este valid." });
    }
    if (poza.length > 7_000_000) {
      return res
        .status(400)
        .json({ message: "Imaginea este prea mare. Maxim 5MB." });
    }
  }

  try {
    const vehicle = await prisma.vehicle.findFirst({
      where: { id, user_id: req.user.id },
    });
    if (!vehicle)
      return res.status(404).json({ message: "Mașina nu a fost găsită." });

    const data = {};
    if (marca !== undefined) data.marca = String(marca).trim();
    if (model !== undefined) data.model = String(model).trim();
    if (nr_inmatriculare !== undefined)
      data.nr_inmatriculare = String(nr_inmatriculare).trim().toUpperCase();
    if (vin !== undefined) data.vin = String(vin).trim().toUpperCase();
    if (an_fabricatie !== undefined) data.an_fabricatie = Number(an_fabricatie);
    if (poza !== undefined) data.poza = poza && poza !== "" ? poza : null;

    const updated = await prisma.vehicle.update({ where: { id }, data });
    res.json({ message: "Mașina a fost actualizată!", vehicle: updated });
  } catch (err) {
    if (err.code === "P2002") {
      return res.status(409).json({ message: "VIN-ul există deja în sistem." });
    }
    res.status(500).json({ message: "Eroare server.", error: err.message });
  }
};

// DELETE /api/vehicles/:id
const deleteVehicle = async (req, res) => {
  try {
    const vehicle = await prisma.vehicle.findFirst({
      where: { id: Number(req.params.id), user_id: req.user.id },
    });
    if (!vehicle)
      return res.status(404).json({ message: "Mașina nu a fost găsită." });

    await prisma.vehicle.delete({ where: { id: Number(req.params.id) } });
    res.json({ message: "Mașina a fost ștearsă." });
  } catch (err) {
    res.status(500).json({ message: "Eroare server.", error: err.message });
  }
};

module.exports = {
  getVehicles,
  getVehicleById,
  createVehicle,
  updateVehicle,
  deleteVehicle,
};
