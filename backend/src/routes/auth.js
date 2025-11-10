import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { pool } from "../db.js";

const router = Router();

router.post("/register", async (req, res) => {
  try {
    const { email, password, firstName, lastName, birthDate, country, city, className } = req.body || {};
    if (!email || !password || !firstName || !lastName) return res.status(400).json({ message: "Wszystkie wymagane pola muszą być wypełnione." });

    const exists = await pool.query("SELECT id FROM users WHERE email=$1", [email]);
    if (exists.rowCount) return res.status(409).json({ message: "Email jest już zajęty" });

    const hash = await bcrypt.hash(password, 12);
    const r = await pool.query(
      `INSERT INTO users (email, password_hash, first_name, last_name, birth_date, country, city, class_name)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
       RETURNING id, email, first_name, last_name`,
      [email, hash, firstName, lastName, birthDate, country || null, city || null, className || null]
    );
    res.status(201).json(r.rows[0]);
  } catch (e) {
    console.error("REGISTER_ERROR", e);
    res.status(500).json({ message: "Błąd serwera" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ message: "Email i hasło są wymagane" });

    const r = await pool.query("SELECT id,email,password_hash FROM users WHERE email=$1", [email]);
    if (!r.rowCount) return res.status(401).json({ message: "Nieprawidłowe dane logowania" });

    const ok = await bcrypt.compare(password, r.rows[0].password_hash);
    if (!ok) return res.status(401).json({ message: "Nieprawidłowe dane logowania" });

    const token = jwt.sign({ sub: r.rows[0].id, email: r.rows[0].email }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.json({ token });
  } catch (e) {
    console.error("LOGIN_ERROR", e);
    res.status(500).json({ message: "Błąd serwera" });
  }
});

export default router;
