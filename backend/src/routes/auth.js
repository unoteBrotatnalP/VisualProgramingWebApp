// backend/src/routes/auth.js
import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { pool } from "../db.js";

const router = Router();

// POST /api/auth/register
router.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email i hasło są wymagane" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `
      INSERT INTO users (email, password_hash)
      VALUES ($1, $2)
      RETURNING id, email
      `,
      [email, hashed]
    );

    const user = result.rows[0];

    const token = jwt.sign(
      { sub: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(201).json({
      token,
      user: { id: user.id, email: user.email },
    });
  } catch (e) {
    console.error("REGISTER_ERROR", e);
    if (e.code === "23505") {
      return res.status(400).json({ message: "Taki email już istnieje" });
    }
    return res.status(500).json({ message: "Błąd rejestracji" });
  }
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await pool.query(
      "SELECT id, email, password_hash FROM users WHERE email = $1",
      [email]
    );
    const user = result.rows[0];

    if (!user) {
      return res.status(401).json({ message: "Nieprawidłowy email lub hasło" });
    }

    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) {
      return res.status(401).json({ message: "Nieprawidłowy email lub hasło" });
    }

    // 👇 KLUCZ: token z `sub` i `email`
    const token = jwt.sign(
      { sub: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({
      token,
      user: { id: user.id, email: user.email },
    });
  } catch (e) {
    console.error("LOGIN_ERROR", e);
    return res.status(500).json({ message: "Błąd logowania" });
  }
});

export default router;
