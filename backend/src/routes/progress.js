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

        // 🏆 Jeśli frontend przekaże dane kategorii, możemy sprawdzić czy przyznać puchar
        const { category, categoryTaskIds } = req.body || {};

        if (
          category &&
          Array.isArray(categoryTaskIds) &&
          categoryTaskIds.length > 0
        ) {
          // policz ile z tej listy user ma ukończone
          const check = await pool.query(
            `
            SELECT COUNT(*)::int AS cnt
            FROM user_task_progress
            WHERE user_id = $1 AND task_id = ANY($2::text[])
            `,
            [userId, categoryTaskIds]
          );

          const completedCount = check.rows[0]?.cnt || 0;

          // jeśli ukończył wszystkie taski z listy -> przyznaj puchar (upsert)
          if (completedCount === categoryTaskIds.length) {
            await pool.query(
              `
              INSERT INTO user_trophies (user_id, category, awarded_at)
              VALUES ($1, $2, NOW())
              ON CONFLICT (user_id, category)
              DO UPDATE SET awarded_at = EXCLUDED.awarded_at
              `,
              [userId, category]
            );
          }
        }


    res.json({ ok: true });
  } catch (e) {
    console.error("PROGRESS_SAVE_ERROR", e);
    res.status(500).json({ message: "Błąd zapisywania progresu" });
  }
});

// DELETE /api/progress  -> usuwa CAŁY progres zalogowanego użytkownika
// DELETE /api/progress -> usuwa progres + puchary użytkownika
router.delete("/", async (req, res) => {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ message: "Brak użytkownika" });

  try {
    await pool.query("BEGIN");
    await pool.query("DELETE FROM user_task_progress WHERE user_id = $1", [userId]);
    await pool.query("DELETE FROM user_trophies WHERE user_id = $1", [userId]);
    await pool.query("COMMIT");
    res.json({ ok: true });
  } catch (e) {
    await pool.query("ROLLBACK");
    console.error("PROGRESS_RESET_ERROR", e);
    res.status(500).json({ message: "Błąd usuwania progresu" });
  }
});


export default router;
