import { Router } from "express";
import { pool } from "../db.js";

const router = Router();

// GET /api/trophies -> lista pucharów zalogowanego usera
router.get("/", async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Brak użytkownika" });

    const r = await pool.query(
      `SELECT category, awarded_at
       FROM user_trophies
       WHERE user_id = $1
       ORDER BY awarded_at DESC`,
      [userId]
    );

    res.json({ trophies: r.rows });
  } catch (e) {
    console.error("TROPHIES_LIST_ERROR", e);
    res.status(500).json({ message: "Błąd pobierania pucharów" });
  }
});

export default router;
