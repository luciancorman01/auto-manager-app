// src/controllers/serviceController.js
const prisma = require("../config/prisma");

const verifyVehicleOwnership = async (vehicleId, userId) => {
  const vehicle = await prisma.vehicle.findFirst({
    where: { id: Number(vehicleId), user_id: userId },
  });
  return !!vehicle;
};

// GET /api/vehicles/:vehicleId/service
const getServiceHistory = async (req, res) => {
  const { vehicleId } = req.params;

  try {
    const owns = await verifyVehicleOwnership(vehicleId, req.user.id);
    if (!owns) return res.status(403).json({ message: "Acces interzis." });

    const history = await prisma.serviceHistory.findMany({
      where: { vehicle_id: Number(vehicleId) },
      orderBy: { data: "desc" },
    });

    res.json(history);
  } catch (err) {
    res.status(500).json({ message: "Eroare server.", error: err.message });
  }
};

// GET /api/vehicles/:vehicleId/service/stats — statistici costuri
const getServiceStats = async (req, res) => {
  const { vehicleId } = req.params;

  try {
    const owns = await verifyVehicleOwnership(vehicleId, req.user.id);
    if (!owns) return res.status(403).json({ message: "Acces interzis." });

    const history = await prisma.serviceHistory.findMany({
      where: { vehicle_id: Number(vehicleId) },
      orderBy: { data: "asc" },
    });

    const total_cheltuieli = history.reduce((sum, h) => sum + h.cost_total, 0);
    const nr_interventii = history.length;
    const cost_mediu = nr_interventii > 0 ? total_cheltuieli / nr_interventii : 0;
    const ultimul_km = history.length > 0 ? history[history.length - 1].kilometri : 0;

    res.json({
      total_cheltuieli,
      nr_interventii,
      cost_mediu: Math.round(cost_mediu * 100) / 100,
      ultimul_km,
    });
  } catch (err) {
    res.status(500).json({ message: "Eroare server.", error: err.message });
  }
};

// POST /api/vehicles/:vehicleId/service
const createServiceEntry = async (req, res) => {
  const { vehicleId } = req.params;
  const { data, descriere, kilometri, cost_total } = req.body;

  if (!data || !descriere || kilometri === undefined || kilometri === null || cost_total === undefined) {
    return res.status(400).json({ message: "Toate câmpurile sunt obligatorii." });
  }

  // Validare dată
  const serviceDate = new Date(data);
  if (isNaN(serviceDate.getTime())) {
    return res.status(400).json({ message: "Data serviciului nu este validă." });
  }

  // Validare descriere
  if (String(descriere).trim().length < 3) {
    return res.status(400).json({ message: "Descrierea trebuie să aibă minim 3 caractere." });
  }

  // Validare kilometri
  const km = Number(kilometri);
  if (isNaN(km) || !Number.isInteger(km) || km < 0) {
    return res.status(400).json({ message: "Kilometrii trebuie să fie un număr întreg pozitiv." });
  }

  // Validare cost
  const cost = Number(cost_total);
  if (isNaN(cost) || cost < 0) {
    return res.status(400).json({ message: "Costul total trebuie să fie un număr pozitiv." });
  }

  try {
    const owns = await verifyVehicleOwnership(vehicleId, req.user.id);
    if (!owns) return res.status(403).json({ message: "Acces interzis." });

    const entry = await prisma.serviceHistory.create({
      data: {
        vehicle_id: Number(vehicleId),
        data: serviceDate,
        descriere: String(descriere).trim(),
        kilometri: km,
        cost_total: cost,
      },
    });

    res.status(201).json({ message: "Intrare service adăugată!", entry });
  } catch (err) {
    res.status(500).json({ message: "Eroare server.", error: err.message });
  }
};

// PUT /api/service/:id
const updateServiceEntry = async (req, res) => {
  const { data, descriere, kilometri, cost_total } = req.body;

  // Validare câmpuri dacă sunt trimise
  if (data !== undefined) {
    const serviceDate = new Date(data);
    if (isNaN(serviceDate.getTime())) {
      return res.status(400).json({ message: "Data serviciului nu este validă." });
    }
  }

  if (descriere !== undefined && String(descriere).trim().length < 3) {
    return res.status(400).json({ message: "Descrierea trebuie să aibă minim 3 caractere." });
  }

  if (kilometri !== undefined) {
    const km = Number(kilometri);
    if (isNaN(km) || !Number.isInteger(km) || km < 0) {
      return res.status(400).json({ message: "Kilometrii trebuie să fie un număr întreg pozitiv." });
    }
  }

  if (cost_total !== undefined) {
    const cost = Number(cost_total);
    if (isNaN(cost) || cost < 0) {
      return res.status(400).json({ message: "Costul total trebuie să fie un număr pozitiv." });
    }
  }

  try {
    const entry = await prisma.serviceHistory.findFirst({
      where: { id: Number(req.params.id) },
      include: { vehicle: true },
    });

    if (!entry || entry.vehicle.user_id !== req.user.id) {
      return res.status(404).json({ message: "Intrarea nu a fost găsită." });
    }

    const updateData = {};
    if (data !== undefined) updateData.data = new Date(data);
    if (descriere !== undefined) updateData.descriere = String(descriere).trim();
    if (kilometri !== undefined) updateData.kilometri = Number(kilometri);
    if (cost_total !== undefined) updateData.cost_total = Number(cost_total);

    const updated = await prisma.serviceHistory.update({
      where: { id: Number(req.params.id) },
      data: updateData,
    });

    res.json({ message: "Intrare actualizată!", entry: updated });
  } catch (err) {
    res.status(500).json({ message: "Eroare server.", error: err.message });
  }
};

// DELETE /api/service/:id
const deleteServiceEntry = async (req, res) => {
  try {
    const entry = await prisma.serviceHistory.findFirst({
      where: { id: Number(req.params.id) },
      include: { vehicle: true },
    });

    if (!entry || entry.vehicle.user_id !== req.user.id) {
      return res.status(404).json({ message: "Intrarea nu a fost găsită." });
    }

    await prisma.serviceHistory.delete({ where: { id: Number(req.params.id) } });

    res.json({ message: "Intrare ștearsă." });
  } catch (err) {
    res.status(500).json({ message: "Eroare server.", error: err.message });
  }
};

module.exports = {
  getServiceHistory,
  getServiceStats,
  createServiceEntry,
  updateServiceEntry,
  deleteServiceEntry,
};
