import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api, { setAuthToken } from "../lib/api";

const box = {
  maxWidth: 380, margin: "60px auto", padding: 24,
  border: "1px solid #eee", borderRadius: 12, boxShadow: "0 6px 18px rgba(0,0,0,.06)",
  fontFamily: "system-ui, sans-serif"
};
const input = { width: "100%", padding: 12, marginTop: 10, borderRadius: 8, border: "1px solid #ddd" };
const btn = { width: "100%", padding: 12, marginTop: 16, borderRadius: 8, border: "none", background: "#4f46e5", color: "#fff", cursor: "pointer" };

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState({ text: "", ok: false });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function onSubmit(e) {
    e.preventDefault();
    setMsg({ text: "", ok: false });
    if (!email || !password) { setMsg({ text: "Podaj email i hasło.", ok: false }); return; }
    setLoading(true);
    try {
      const { data } = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", data.token);
      setAuthToken(data.token);
      setMsg({ text: "Zalogowano", ok: true });
      setTimeout(()=> navigate("/"), 600);
    } catch (err) {
      const m = err.response?.data?.message || "Błąd logowania";
      setMsg({ text: m, ok: false });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} style={box}>
      <h2 style={{ margin: 0 }}>Logowanie</h2>
      <p style={{ color: "#666", marginTop: 6 }}>Wpisz dane, aby się zalogować.</p>

      <input style={input} type="email" placeholder="email" value={email} onChange={(e)=>setEmail(e.target.value)} />
      <input style={input} type="password" placeholder="hasło" value={password} onChange={(e)=>setPassword(e.target.value)} />

      <button style={btn} disabled={loading}>{loading ? "Logowanie..." : "Zaloguj"}</button>
      {msg.text && <div style={{ marginTop:12, color: msg.ok ? "#16a34a" : "#dc2626" }}>{msg.text}</div>}

      <div className="form-footer">
        <span>Nie masz konta? <Link to="/register">Zarejestruj się</Link></span>
        <Link to="/" className="btn back-btn">Home</Link>
      </div>
    </form>
  );
}
