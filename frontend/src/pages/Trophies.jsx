import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../lib/api";

export default function Trophies() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);
  const [trophies, setTrophies] = useState([]);

  const token = localStorage.getItem("token");

  const load = async () => {
    if (!token) {
      navigate("/login");
      return;
    }

    setLoading(true);
    setErr(null);

    try {
      // Backend powinien zwracać np. { trophies: [...] }
      const res = await api.get("/trophies");
      setTrophies(res.data?.trophies || []);
    } catch (e) {
      setErr(e.response?.data?.message || "Nie udało się pobrać pucharów.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();

    const onUpdate = () => load();
    window.addEventListener("trophiesUpdated", onUpdate);
    return () => window.removeEventListener("trophiesUpdated", onUpdate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={{ maxWidth: 900, margin: "24px auto", padding: 16, fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
        <h2 style={{ margin: 0 }}>Osiągnięcia</h2>
        <Link to="/blockly" style={{ textDecoration: "none", color: "#2563eb" }}>← Zadania</Link>
      </div>

      <p style={{ color: "#666", marginTop: 6 }}>
        Puchary są przyznawane za ukończenie wszystkich zadań w danej kategorii.
      </p>

      {loading && <div>Ładowanie…</div>}
      {!loading && err && (
        <div style={{ marginTop: 12, padding: 12, borderRadius: 10, background: "#fef2f2", border: "1px solid #fecaca", color: "#991b1b" }}>
          {err}
        </div>
      )}

      {!loading && !err && trophies.length === 0 && (
        <div style={{ marginTop: 12, padding: 12, borderRadius: 10, background: "#f9fafb", border: "1px solid #eee" }}>
          Nie masz jeszcze żadnych pucharów.
        </div>
      )}

      {!loading && !err && trophies.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 12, marginTop: 14 }}>
          {trophies.map((t) => (
            <div
              key={t.category}
              style={{
                border: "1px solid #eee",
                borderRadius: 14,
                padding: 14,
                boxShadow: "0 6px 18px rgba(0,0,0,.05)",
                background: "#fff",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                gap: 12,
              }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 16 }}>{t.title || `Kategoria: ${t.category}`}</div>
                <div style={{ color: "#666", marginTop: 6, fontSize: 13 }}>
                  {t.description || "Ukończono całą kategorię"}
                </div>
                {t.awarded_at && (
                  <div style={{ marginTop: 10, fontSize: 12, color: "#6b7280" }}>
                    Przyznano: {new Date(t.awarded_at).toLocaleString()}
                  </div>
                )}
              </div>
              <div style={{ fontSize: 48, lineHeight: 1, flexShrink: 0 }}>🏆</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
