import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api, { setAuthToken } from "../lib/api";

const box = {
  maxWidth: 380, margin: "60px auto", padding: 24,
  border: "1px solid #eee", borderRadius: 12, boxShadow: "0 6px 18px rgba(0,0,0,.06)",
  fontFamily: "system-ui, sans-serif"
};
const input = { width: "100%", padding: 12, marginTop: 10, borderRadius: 8, border: "1px solid #ddd" };
const btn = { width: "100%", padding: 12, marginTop: 16, borderRadius: 8, border: "none", background: "#4f46e5", color: "#fff", cursor: "pointer" };

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
      // Krok 1: Zarejestruj użytkownika
      await api.post("/auth/register", { email, password });

      // Krok 2: Jeśli rejestracja się powiodła, od razu zaloguj
      // użytkownika (wysyłając te same dane), aby pobrać token
      const { data } = await api.post("/auth/login", { email, password });

      // Krok 3: Zapisz token i przekieruj na stronę główną
      localStorage.setItem("token", data.token);
      if (typeof setAuthToken === 'function') {
        setAuthToken(data.token);
      }
      
      setMsg({ text: "Konto utworzone. Zalogowano!", ok: true });
      // Przekierowujemy na stronę główną (/)
      setTimeout(()=> navigate("/"), 800);
      
    } catch (err) {
      // Błąd może pochodzić z rejestracji LUB logowania
      const m = err.response?.data?.message || "Błąd rejestracji lub logowania";
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
      {msg.text && <div style={{ marginTop:12, color: msg.ok ? "#16a34a" : "#dc2626" }}>{msg.text}</div>}

      <div className="form-footer">
        <span>Masz już konto? <Link to="/login">Zaloguj się</Link></span>
        <Link to="/" className="btn back-btn">Home</Link>
      </div>
    </form>
  );
}