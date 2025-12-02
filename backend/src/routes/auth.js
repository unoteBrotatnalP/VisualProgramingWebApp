// backend/src/routes/auth.js
import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { pool } from "../db.js";
import requireAuth from "../middlewares/requireAuth.js";

const router = Router();

function makeToken(user) {
  return jwt.sign(
    { sub: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
}

// POST /api/auth/register
router.post("/register", async (req, res) => {
  try {
    const { 
      email, 
      password, 
      firstName, 
      lastName, 
      birthDate, 
      country, 
      city, 
      className 
    } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email i hasło są wymagane" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `
      INSERT INTO users (email, password_hash, first_name, last_name, birth_date, country, city, class_name)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING id, email, first_name, last_name, birth_date, country, city, class_name
      `,
      [email, hashed, firstName || null, lastName || null, birthDate || null, country || null, city || null, className || null]
    );

    const user = result.rows[0];
    const token = makeToken(user);

    return res.status(201).json({
      token,
      user: { 
        id: user.id, 
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        birth_date: user.birth_date,
        country: user.country,
        city: user.city,
        class_name: user.class_name
      },
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
      "SELECT id, email, password_hash, first_name, last_name, birth_date, country, city, class_name FROM users WHERE email = $1",
      [email]
    );
    const user = result.rows[0];

    if (!user) {
      return res
        .status(401)
        .json({ message: "Nieprawidłowy email lub hasło" });
    }

    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) {
      return res
        .status(401)
        .json({ message: "Nieprawidłowy email lub hasło" });
    }

    const token = makeToken(user);

    return res.json({
      token,
      user: { 
        id: user.id, 
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        birth_date: user.birth_date,
        country: user.country,
        city: user.city,
        class_name: user.class_name
      },
    });
  } catch (e) {
    console.error("LOGIN_ERROR", e);
    return res.status(500).json({ message: "Błąd logowania" });
  }
});

// GET /api/auth/me  -> dane zalogowanego użytkownika
router.get("/me", requireAuth, async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await pool.query(
      `
      SELECT id, email, first_name, last_name, country, city, class_name
      FROM users
      WHERE id = $1
      `,
      [userId]
    );
    const user = result.rows[0];
    if (!user) {
      return res.status(404).json({ message: "Użytkownik nie istnieje" });
    }
    return res.json({ user });
  } catch (e) {
    console.error("ME_ERROR", e);
    return res.status(500).json({ message: "Błąd pobierania danych użytkownika" });
  }
});

// PUT /api/auth/me/email  -> zmiana adresu email (wymaga hasła)
router.put("/me/email", requireAuth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { newEmail, password } = req.body;

    if (!newEmail || !password) {
      return res
        .status(400)
        .json({ message: "Podaj nowy email i obecne hasło" });
    }

    const result = await pool.query(
      "SELECT id, email, password_hash FROM users WHERE id = $1",
      [userId]
    );
    const user = result.rows[0];
    if (!user) {
      return res.status(404).json({ message: "Użytkownik nie istnieje" });
    }

    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) {
      return res.status(401).json({ message: "Błędne hasło" });
    }

    const update = await pool.query(
      `
      UPDATE users
      SET email = $1
      WHERE id = $2
      RETURNING id, email
      `,
      [newEmail, userId]
    );

    const updated = update.rows[0];

    // nowy token z aktualnym emailem
    const token = makeToken(updated);

    return res.json({
      token,
      user: { id: updated.id, email: updated.email },
    });
  } catch (e) {
    console.error("CHANGE_EMAIL_ERROR", e);
    if (e.code === "23505") {
      return res
        .status(400)
        .json({ message: "Podany email jest już używany" });
    }
    return res
      .status(500)
      .json({ message: "Błąd zmiany adresu email" });
  }
});

// PUT /api/auth/me/password  -> zmiana hasła
router.put("/me/password", requireAuth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res
        .status(400)
        .json({ message: "Podaj obecne i nowe hasło" });
    }

    const result = await pool.query(
      "SELECT id, password_hash FROM users WHERE id = $1",
      [userId]
    );
    const user = result.rows[0];
    if (!user) {
      return res.status(404).json({ message: "Użytkownik nie istnieje" });
    }

    const ok = await bcrypt.compare(currentPassword, user.password_hash);
    if (!ok) {
      return res.status(401).json({ message: "Obecne hasło jest nieprawidłowe" });
    }

    if (newPassword.length < 6) {
      return res
        .status(400)
        .json({ message: "Nowe hasło powinno mieć co najmniej 6 znaków" });
    }

    const newHash = await bcrypt.hash(newPassword, 10);
    await pool.query(
      "UPDATE users SET password_hash = $1 WHERE id = $2",
      [newHash, userId]
    );

    return res.json({ ok: true, message: "Hasło zostało zmienione" });
  } catch (e) {
    console.error("CHANGE_PASSWORD_ERROR", e);
    return res
      .status(500)
      .json({ message: "Błąd zmiany hasła" });
  }
});

export default router;
