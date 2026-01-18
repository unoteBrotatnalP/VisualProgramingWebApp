import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api, { setAuthToken } from "../lib/api";
import { useUser } from "../context/UserContext";

const box = {
  maxWidth: 420,
  margin: "60px auto",
  padding: 24,
  border: "1px solid #eee",
  borderRadius: 12,
  boxShadow: "0 6px 18px rgba(0,0,0,.06)",
  fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  background: "#fff",
};

const input = {
  width: "100%",
  padding: 12,
  marginTop: 10,
  borderRadius: 8,
  border: "1px solid #ddd",
  boxSizing: "border-box",
};

const btn = {
  width: "100%",
  padding: 12,
  marginTop: 16,
  borderRadius: 8,
  border: "none",
  background: "#4f46e5",
  color: "#fff",
  cursor: "pointer",
};

export default function Register() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    birthDate: "",
    country: "",
    city: "",
    className: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [msg, setMsg] = useState({ text: "", ok: false });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useUser();

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" }); // czyścimy błąd po wpisaniu
  }

  function validate() {
    const newErrors = {};
    if (!form.firstName.trim()) newErrors.firstName = "Pole Imię jest wymagane.";
    if (!form.lastName.trim()) newErrors.lastName = "Pole Nazwisko jest wymagane.";
    if (!form.birthDate.trim()) newErrors.birthDate = "Pole Data urodzenia jest wymagane.";
    if (!form.email.trim()) newErrors.email = "Pole Email jest wymagane.";
    if (!form.password.trim()) newErrors.password = "Pole Hasło jest wymagane.";
    else if (form.password.length < 6)
      newErrors.password = "Hasło musi mieć co najmniej 6 znaków.";

    return newErrors;
  }

  async function onSubmit(e) {
    e.preventDefault();
    setMsg({ text: "", ok: false });

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      await api.post("/auth/register", form);
      const { data } = await api.post("/auth/login", {
        email: form.email,
        password: form.password,
      });

      // Używamy funkcji login z UserContext, która automatycznie pobierze pełne dane użytkownika
      await login(data.token);

      setMsg({ text: "Konto utworzone. Zalogowano!", ok: true });
      setTimeout(() => navigate("/"), 800);
    } catch (err) {
      const m = err.response?.data?.message || "Błąd rejestracji lub logowania.";
      setMsg({ text: m, ok: false });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} style={box}>
      <h2 style={{ margin: 0 }}>Rejestracja</h2>
      <p style={{ color: "#666", marginTop: 6 }}>Utwórz nowe konto.</p>

      <input
        style={input}
        type="text"
        name="firstName"
        placeholder="Imię"
        value={form.firstName}
        onChange={handleChange}
      />
      {errors.firstName && (
        <div style={{ color: "#dc2626", fontSize: 13 }}>{errors.firstName}</div>
      )}

      <input
        style={input}
        type="text"
        name="lastName"
        placeholder="Nazwisko"
        value={form.lastName}
        onChange={handleChange}
      />
      {errors.lastName && (
        <div style={{ color: "#dc2626", fontSize: 13 }}>{errors.lastName}</div>
      )}

      <input
        style={input}
        type="date"
        name="birthDate"
        placeholder="Data urodzenia *"
        value={form.birthDate}
        onChange={handleChange}
      />
      {errors.birthDate && (
        <div style={{ color: "#dc2626", fontSize: 13 }}>{errors.birthDate}</div>
      )}

      <input
        style={input}
        type="text"
        name="country"
        placeholder="Kraj (opcjonalne)"
        value={form.country}
        onChange={handleChange}
      />

      <input
        style={input}
        type="text"
        name="city"
        placeholder="Miasto (opcjonalne)"
        value={form.city}
        onChange={handleChange}
      />

      <input
        style={input}
        type="text"
        name="className"
        placeholder="Klasa (opcjonalne, np. 3A)"
        value={form.className}
        onChange={handleChange}
      />

      <input
        style={input}
        type="email"
        name="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
      />
      {errors.email && (
        <div style={{ color: "#dc2626", fontSize: 13 }}>{errors.email}</div>
      )}

      <input
        style={input}
        type="password"
        name="password"
        placeholder="Hasło (min. 6 znaków)"
        value={form.password}
        onChange={handleChange}
      />
      {errors.password && (
        <div style={{ color: "#dc2626", fontSize: 13 }}>{errors.password}</div>
      )}

      <button style={btn} disabled={loading}>
        {loading ? "Rejestrowanie..." : "Utwórz konto"}
      </button>

      {msg.text && (
        <div
          style={{
            marginTop: 12,
            color: msg.ok ? "#16a34a" : "#dc2626",
          }}
        >
          {msg.text}
        </div>
      )}

      <div className="form-footer">
        <span>
          Masz już konto? <Link to="/login">Zaloguj się</Link>
        </span>
        <Link to="/" className="btn back-btn">
          Home
        </Link>
      </div>
    </form>
  );
}
