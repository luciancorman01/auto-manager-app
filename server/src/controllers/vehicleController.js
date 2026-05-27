// src/controllers/vehicleController.js
const fs = require("fs");
const path = require("path");
const prisma = require("../config/prisma");

// GET /api/vehicles — toate mașinile userului logat
const getVehicles = async (req, res) => {
  try {
    const vehicles = await prisma.vehicle.findMany({
      where: { user_id: req.user.id },
      include: {
        documents: true,
        serviceHistory: { orderBy: { data: "desc" }, take: 1 },
        photos: { orderBy: [{ is_primary: "desc" }, { createdAt: "desc" }] },
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
        photos: { orderBy: [{ is_primary: "desc" }, { createdAt: "desc" }] },
      },
    });

    if (!vehicle) return res.status(404).json({ message: "Mașina nu a fost găsită." });

    res.json(vehicle);
  } catch (err) {
    res.status(500).json({ message: "Eroare server.", error: err.message });
  }
};

// POST /api/vehicles/:id/photos
const uploadPhoto = async (req, res) => {
  try {
    const vehicle = await prisma.vehicle.findFirst({
      where: { id: Number(req.params.id), user_id: req.user.id },
    });

    if (!vehicle) return res.status(404).json({ message: "Mașina nu a fost găsită." });
    if (!req.file) return res.status(400).json({ message: "Lipsește fișierul imagine." });
    const photosCount = await prisma.vehiclePhoto.count({ where: { vehicle_id: vehicle.id } });

    const photo = await prisma.vehiclePhoto.create({
      data: {
        vehicle_id: vehicle.id,
        image_url: `/uploads/${req.file.filename}`,
        is_primary: photosCount === 0,
      },
    });

    res.status(201).json({ message: "Poza a fost încărcată!", photo });
  } catch (err) {
    res.status(500).json({ message: "Eroare server.", error: err.message });
  }
};

// DELETE /api/vehicles/:id/photos/:photoId
const deletePhoto = async (req, res) => {
  try {
    const vehicle = await prisma.vehicle.findFirst({
      where: { id: Number(req.params.id), user_id: req.user.id },
    });
    if (!vehicle) return res.status(404).json({ message: "Mașina nu a fost găsită." });

    const photo = await prisma.vehiclePhoto.findFirst({
      where: { id: Number(req.params.photoId), vehicle_id: vehicle.id },
    });
    if (!photo) return res.status(404).json({ message: "Poza nu a fost găsită." });

    await prisma.vehiclePhoto.delete({ where: { id: photo.id } });
    const relativeImagePath = photo.image_url.replace(/^\/+/, "");
    const absoluteImagePath = path.join(__dirname, "../../", relativeImagePath);
    if (fs.existsSync(absoluteImagePath)) {
      fs.unlinkSync(absoluteImagePath);
    }
    if (photo.is_primary) {
      const replacementPhoto = await prisma.vehiclePhoto.findFirst({
        where: { vehicle_id: vehicle.id },
        orderBy: { createdAt: "desc" },
      });
      if (replacementPhoto) {
        await prisma.vehiclePhoto.update({
          where: { id: replacementPhoto.id },
          data: { is_primary: true },
        });
      }
    }

    res.json({ message: "Poza a fost ștearsă." });
  } catch (err) {
    res.status(500).json({ message: "Eroare server.", error: err.message });
  }
};

// PATCH /api/vehicles/:id/photos/:photoId/primary
const setPrimaryPhoto = async (req, res) => {
  try {
    const vehicle = await prisma.vehicle.findFirst({
      where: { id: Number(req.params.id), user_id: req.user.id },
    });
    if (!vehicle) return res.status(404).json({ message: "Mașina nu a fost găsită." });

    const photo = await prisma.vehiclePhoto.findFirst({
      where: { id: Number(req.params.photoId), vehicle_id: vehicle.id },
    });
    if (!photo) return res.status(404).json({ message: "Poza nu a fost găsită." });

    await prisma.$transaction([
      prisma.vehiclePhoto.updateMany({
        where: { vehicle_id: vehicle.id, is_primary: true },
        data: { is_primary: false },
      }),
      prisma.vehiclePhoto.update({
        where: { id: photo.id },
        data: { is_primary: true },
      }),
    ]);

    res.json({ message: "Poza principală a fost actualizată." });
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

module.exports = {
  getVehicles,
  getVehicleById,
  createVehicle,
  updateVehicle,
  deleteVehicle,
  uploadPhoto,
  deletePhoto,
  setPrimaryPhoto,
};
