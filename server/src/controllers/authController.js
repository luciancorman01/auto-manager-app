// src/controllers/authController.js
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const prisma = require("../config/prisma");

const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );
};

// POST /api/auth/register
const register = async (req, res) => {
  const { nume_complet, email, parola, poza_profil } = req.body;

  if (!nume_complet || !email || !parola) {
    return res.status(400).json({ message: "Toate câmpurile sunt obligatorii." });
  }

  try {
    const userExistent = await prisma.user.findUnique({ where: { email } });
    if (userExistent) {
      return res.status(409).json({ message: "Email-ul este deja folosit." });
    }

    const hashedParola = await bcrypt.hash(parola, 10);

    const user = await prisma.user.create({
      data: { nume_complet, email, parola: hashedParola, poza_profil },
      select: { id: true, nume_complet: true, email: true, poza_profil: true, createdAt: true },
    });

    const token = generateToken(user);

    res.status(201).json({ message: "Cont creat cu succes!", user, token });
  } catch (err) {
    res.status(500).json({ message: "Eroare server.", error: err.message });
  }
};

// POST /api/auth/login
const login = async (req, res) => {
  const { email, parola } = req.body;

  if (!email || !parola) {
    return res.status(400).json({ message: "Email și parola sunt obligatorii." });
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: "Email sau parolă incorectă." });
    }

    const parolaCorectă = await bcrypt.compare(parola, user.parola);
    if (!parolaCorectă) {
      return res.status(401).json({ message: "Email sau parolă incorectă." });
    }

    const token = generateToken(user);

    res.json({
      message: "Autentificare reușită!",
      user: { id: user.id, nume_complet: user.nume_complet, email: user.email, poza_profil: user.poza_profil },
      token,
    });
  } catch (err) {
    res.status(500).json({ message: "Eroare server.", error: err.message });
  }
};

// GET /api/auth/me
const getProfile = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, nume_complet: true, email: true, poza_profil: true, createdAt: true },
    });

    if (!user) return res.status(404).json({ message: "Utilizatorul nu există." });

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Eroare server.", error: err.message });
  }
};

// PUT /api/auth/me
const updateProfile = async (req, res) => {
  const { nume_complet, poza_profil, parola } = req.body;

  try {
    const data = {};
    if (nume_complet) data.nume_complet = nume_complet;
    if (poza_profil) data.poza_profil = poza_profil;
    if (parola) data.parola = await bcrypt.hash(parola, 10);

    const user = await prisma.user.update({
      where: { id: req.user.id },
      data,
      select: { id: true, nume_complet: true, email: true, poza_profil: true },
    });

    res.json({ message: "Profil actualizat!", user });
  } catch (err) {
    res.status(500).json({ message: "Eroare server.", error: err.message });
  }
};

module.exports = { register, login, getProfile, updateProfile };
