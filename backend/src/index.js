import "dotenv/config";
import express from "express";
import cors from "cors";
import { ensureSchema } from "./db.js";
import authRouter from "./routes/auth.js";
import progressRouter from "./routes/progress.js";     // 👈 NOWE
import requireAuth from "./middlewares/requireAuth.js"; // 👈 NOWE

const app = express();
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());

app.get("/api/health", (_req, res) => res.json({ ok: true }));
app.use("/api/auth", authRouter);

// 🔐 Wszystkie endpointy progresu wymagają zalogowania
app.use("/api/progress", requireAuth, progressRouter);

const port = process.env.PORT || 4000;
ensureSchema()
  .then(() => {
    app.listen(port, () =>
      console.log(`API running on http://localhost:${port}`)
    );
  })
  .catch((e) => {
    console.error("DB_INIT_ERROR", e);
    process.exit(1);
  });
