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

  // Validare nume
  if (String(nume_complet).trim().length < 3) {
    return res.status(400).json({ message: "Numele complet trebuie să aibă minim 3 caractere." });
  }

  // Validare email format
  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!EMAIL_REGEX.test(String(email).trim())) {
    return res.status(400).json({ message: "Adresa de email nu este validă." });
  }

  // Validare parolă
  if (String(parola).length < 6) {
    return res.status(400).json({ message: "Parola trebuie să aibă minim 6 caractere." });
  }

  try {
    const userExistent = await prisma.user.findUnique({ where: { email: String(email).trim().toLowerCase() } });
    if (userExistent) {
      return res.status(409).json({ message: "Email-ul este deja folosit." });
    }

    const hashedParola = await bcrypt.hash(parola, 10);

    const user = await prisma.user.create({
      data: {
        nume_complet: String(nume_complet).trim(),
        email: String(email).trim().toLowerCase(),
        parola: hashedParola,
        poza_profil: poza_profil || null,
      },
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

  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!EMAIL_REGEX.test(String(email).trim())) {
    return res.status(400).json({ message: "Adresa de email nu este validă." });
  }

  try {
    const user = await prisma.user.findUnique({ where: { email: String(email).trim().toLowerCase() } });
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
