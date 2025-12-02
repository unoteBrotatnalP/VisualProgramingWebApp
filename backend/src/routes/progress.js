import { Router } from "express";
import { pool } from "../db.js";

const router = Router();

// GET /api/progress  -> lista ukończonych zadań dla zalogowanego użytkownika
router.get("/", async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Brak użytkownika" });

    const r = await pool.query(
      "SELECT task_id FROM user_task_progress WHERE user_id = $1",
      [userId]
    );

    const completed = r.rows.map((row) => row.task_id);
    res.json({ completed });
  } catch (e) {
    console.error("PROGRESS_LIST_ERROR", e);
    res.status(500).json({ message: "Błąd pobierania progresu" });
  }


});

// POST /api/progress/:taskId/complete  -> oznacza zadanie jako ukończone
router.post("/:taskId/complete", async (req, res) => {
  try {
    const userId = req.user?.id;
    const { taskId } = req.params;

    if (!userId) return res.status(401).json({ message: "Brak użytkownika" });
    if (!taskId) return res.status(400).json({ message: "Brak ID zadania" });

    await pool.query(
      `
      INSERT INTO user_task_progress (user_id, task_id, completed_at)
      VALUES ($1, $2, NOW())
      ON CONFLICT (user_id, task_id)
      DO UPDATE SET completed_at = EXCLUDED.completed_at
      `,
      [userId, taskId]
    );

    res.json({ ok: true });
  } catch (e) {
    console.error("PROGRESS_SAVE_ERROR", e);
    res.status(500).json({ message: "Błąd zapisywania progresu" });
  }
});

// DELETE /api/progress  -> usuwa CAŁY progres zalogowanego użytkownika
router.delete("/", async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Brak użytkownika" });
    }

    await pool.query(
      "DELETE FROM user_task_progress WHERE user_id = $1",
      [userId]
    );

    return res.json({ ok: true });
  } catch (e) {
    console.error("PROGRESS_DELETE_ERROR", e);
    return res.status(500).json({ message: "Błąd usuwania progresu" });
  }
});

export default router;
