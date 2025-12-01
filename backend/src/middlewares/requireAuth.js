// backend/src/middlewares/requireAuth.js
import jwt from "jsonwebtoken";

export default function requireAuth(req, res, next) {
  try {
    const auth = req.headers.authorization || "";
    const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;

    if (!token) {
      return res.status(401).json({ message: "Brak tokenu autoryzacji" });
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET);

    // obsługujemy sub (nasz przypadek) i id (gdyby coś było inaczej)
    const userId = payload.sub ?? payload.id;
    if (!userId) {
      console.error("AUTH_ERROR: brak sub/id w payloadzie", payload);
      return res
        .status(401)
        .json({ message: "Nieprawidłowy token (brak ID użytkownika)" });
    }

    req.user = {
      id: userId,
      email: payload.email,
    };

    next();
  } catch (e) {
    console.error("AUTH_ERROR", e);
    return res
      .status(401)
      .json({ message: "Nieprawidłowy lub wygasły token" });
  }
}
