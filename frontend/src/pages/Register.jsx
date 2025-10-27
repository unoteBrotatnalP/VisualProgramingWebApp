import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../lib/api";

const box = {
  maxWidth: 380, margin: "60px auto", padding: 24,
  border: "1px solid #eee", borderRadius: 12, boxShadow: "0 6px 18px rgba(0,0,0,.06)",
  fontFamily: "system-ui, sans-serif"
};
const input = { width: "100%", padding: 12, marginTop: 10, borderRadius: 8, border: "1px solid #ddd" };
const btn = { width: "100%", padding: 12, marginTop: 16, borderRadius: 8, border: "none", background: "#4f46e5", color: "#fff", cursor: "pointer" };
const msgStyle = (ok)=>({ marginTop: 12, color: ok ? "#16a34a" : "#dc2626" });

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState({ text: "", ok: false });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function onSubmit(e) {
    e.preventDefault();
    setMsg({ text: "", ok: false });
    if (!email || !password) { setMsg({ text: "Podaj email i hasło.", ok: false }); return; }
    if (password.length < 6) { setMsg({ text: "Hasło min. 6 znaków.", ok: false }); return; }
    setLoading(true);
    try {
      await api.post("/auth/register", { email, password });
      setMsg({ text: "Utworzono konto, Możesz się zalogować.", ok: true });
      setTimeout(()=> navigate("/login"), 800);
    } catch (err) {
      const m = err.response?.data?.message || "Błąd rejestracji";
      setMsg({ text: m, ok: false });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} style={box}>
      <h2 style={{ margin: 0 }}>Rejestracja</h2>
      <p style={{ color: "#666", marginTop: 6 }}>Utwórz nowe konto.</p>

      <input style={input} type="email" placeholder="email" value={email} onChange={(e)=>setEmail(e.target.value)} />
      <input style={input} type="password" placeholder="hasło (min. 6 znaków)" value={password} onChange={(e)=>setPassword(e.target.value)} />

      <button style={btn} disabled={loading}>{loading ? "Rejestrowanie..." : "Utwórz konto"}</button>
      {msg.text && <div style={msgStyle(msg.ok)}>{msg.text}</div>}

      <p style={{ marginTop: 14, fontSize: 14 }}>
        Masz już konto? <Link to="/login">Zaloguj się</Link>
      </p>
    </form>
  );
}
