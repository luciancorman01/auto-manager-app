// src/controllers/vehicleController.js
const prisma = require("../config/prisma");

// GET /api/vehicles — toate mașinile userului logat
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
  try {
    const vehicle = await prisma.vehicle.findFirst({
      where: { id: Number(req.params.id), user_id: req.user.id },
      include: {
        documents: { orderBy: { data_expirare: "asc" } },
        serviceHistory: { orderBy: { data: "desc" } },
      },
    });

    if (!vehicle) return res.status(404).json({ message: "Mașina nu a fost găsită." });

    res.json(vehicle);
  } catch (err) {
    res.status(500).json({ message: "Eroare server.", error: err.message });
  }
};

// POST /api/vehicles
const createVehicle = async (req, res) => {
  const { marca, model, nr_inmatriculare, vin, an_fabricatie } = req.body;

  if (!marca || !model || !nr_inmatriculare || !vin || !an_fabricatie) {
    return res.status(400).json({ message: "Toate câmpurile sunt obligatorii." });
  }

  try {
    const vehicle = await prisma.vehicle.create({
      data: {
        user_id: req.user.id,
        marca,
        model,
        nr_inmatriculare,
        vin,
        an_fabricatie: Number(an_fabricatie),
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
  const { marca, model, nr_inmatriculare, vin, an_fabricatie } = req.body;

  try {
    const vehicle = await prisma.vehicle.findFirst({
      where: { id: Number(req.params.id), user_id: req.user.id },
    });

    if (!vehicle) return res.status(404).json({ message: "Mașina nu a fost găsită." });

    const updated = await prisma.vehicle.update({
      where: { id: Number(req.params.id) },
      data: { marca, model, nr_inmatriculare, vin, an_fabricatie: Number(an_fabricatie) },
    });

    res.json({ message: "Mașina a fost actualizată!", vehicle: updated });
  } catch (err) {
    res.status(500).json({ message: "Eroare server.", error: err.message });
  }
};

// DELETE /api/vehicles/:id
const deleteVehicle = async (req, res) => {
  try {
    const vehicle = await prisma.vehicle.findFirst({
      where: { id: Number(req.params.id), user_id: req.user.id },
    });

    if (!vehicle) return res.status(404).json({ message: "Mașina nu a fost găsită." });

    await prisma.vehicle.delete({ where: { id: Number(req.params.id) } });

    res.json({ message: "Mașina a fost ștearsă." });
  } catch (err) {
    res.status(500).json({ message: "Eroare server.", error: err.message });
  }
};

module.exports = { getVehicles, getVehicleById, createVehicle, updateVehicle, deleteVehicle };
