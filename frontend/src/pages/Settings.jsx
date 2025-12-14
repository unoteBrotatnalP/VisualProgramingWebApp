// frontend/src/pages/Settings.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api, { setAuthToken } from "../lib/api";

export default function Settings() {
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [profileError, setProfileError] = useState(null);

  // dane profilu
  const [email, setEmail] = useState("");
  const [changingEmail, setChangingEmail] = useState(false);
  const [emailPassword, setEmailPassword] = useState("");
  const [emailStatus, setEmailStatus] = useState(null); // { ok, text }

  // zmiana hasła
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPassword2, setNewPassword2] = useState("");
  const [passwordStatus, setPasswordStatus] = useState(null);
  const [changingPassword, setChangingPassword] = useState(false);

  // progres
  const [clearingProgress, setClearingProgress] = useState(false);
  const [progressStatus, setProgressStatus] = useState(null);

  const navigate = useNavigate();

  // pobierz aktualne dane (email) z backendu
  useEffect(() => {
    let mounted = true;
    async function loadMe() {
      setLoadingProfile(true);
      setProfileError(null);
      try {
        const { data } = await api.get("/auth/me");
        if (!mounted) return;
        setEmail(data.user.email || "");
      } catch (err) {
        if (!mounted) return;
        const msg =
          err.response?.data?.message || "Nie udało się pobrać danych konta.";
        setProfileError(msg);
      } finally {
        if (mounted) setLoadingProfile(false);
      }
    }
    loadMe();
    return () => {
      mounted = false;
    };
  }, []);

  // Zmiana emaila
  const handleChangeEmail = async (e) => {
    e.preventDefault();
    setEmailStatus(null);

    if (!email) {
      setEmailStatus({ ok: false, text: "Podaj nowy adres email." });
      return;
    }
    if (!emailPassword) {
      setEmailStatus({
        ok: false,
        text: "Podaj swoje obecne hasło, aby zmienić email.",
      });
      return;
    }

    setChangingEmail(true);
    try {
      const { data } = await api.put("/auth/me/email", {
        newEmail: email,
        password: emailPassword,
      });

      // zaktualizuj token + email w localStorage
      if (data.token) {
        setAuthToken(data.token);
      }
      if (data.user?.email) {
        localStorage.setItem("email", data.user.email);
      }

      setEmailStatus({
        ok: true,
        text: "Adres email został zaktualizowany.",
      });
      setEmailPassword("");
    } catch (err) {
      const msg =
        err.response?.data?.message || "Nie udało się zmienić adresu email.";
      setEmailStatus({ ok: false, text: msg });
    } finally {
      setChangingEmail(false);
    }
  };

  // Zmiana hasła
  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordStatus(null);

    if (!currentPassword || !newPassword || !newPassword2) {
      setPasswordStatus({
        ok: false,
        text: "Wypełnij wszystkie pola dotyczące hasła.",
      });
      return;
    }
    if (newPassword !== newPassword2) {
      setPasswordStatus({
        ok: false,
        text: "Nowe hasło i powtórzenie nie są takie same.",
      });
      return;
    }
    if (newPassword.length < 6) {
      setPasswordStatus({
        ok: false,
        text: "Nowe hasło musi mieć co najmniej 6 znaków.",
      });
      return;
    }

    setChangingPassword(true);
    try {
      const { data } = await api.put("/auth/me/password", {
        currentPassword,
        newPassword,
      });

      setPasswordStatus({
        ok: true,
        text: data.message || "Hasło zostało zmienione.",
      });
      setCurrentPassword("");
      setNewPassword("");
      setNewPassword2("");
    } catch (err) {
      const msg =
        err.response?.data?.message || "Nie udało się zmienić hasła.";
      setPasswordStatus({ ok: false, text: msg });
    } finally {
      setChangingPassword(false);
    }
  };

  // Czyszczenie progresu
  const handleClearProgress = async () => {
    const confirmed = window.confirm(
      "Na pewno usunąć cały progres zadań dla tego konta?\n" +
        "Tego nie da się cofnąć."
    );
    if (!confirmed) return;

    setClearingProgress(true);
    setProgressStatus(null);

    try {
      await api.delete("/progress");
      setProgressStatus({
        ok: true,
        text: "Progres został usunięty. Po odświeżeniu listy zadań zobaczysz 0/5.",
      });
    } catch (err) {
      const msg =
        err.response?.data?.message || "Nie udało się usunąć progresu.";
      setProgressStatus({ ok: false, text: msg });
    } finally {
      setClearingProgress(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: 720,
        margin: "40px auto",
        padding: 24,
        borderRadius: 12,
        border: "1px solid #e5e7eb",
        boxShadow: "0 8px 24px rgba(0,0,0,.05)",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      <h2 style={{ marginTop: 0, marginBottom: 8 }}>Ustawienia konta</h2>
      <p style={{ marginTop: 0, color: "#4b5563" }}>
        Zarządzaj swoim kontem, danymi logowania oraz progresem zadań.
      </p>

      {/* Sekcja: Podstawowe dane */}
      <section style={{ marginTop: 24 }}>
        <h3 style={{ marginBottom: 8 }}>Dane konta</h3>
        {loadingProfile ? (
          <p style={{ color: "#6b7280", fontSize: 14 }}>Ładowanie danych...</p>
        ) : profileError ? (
          <p style={{ color: "#b91c1c", fontSize: 14 }}>{profileError}</p>
        ) : (
          <form onSubmit={handleChangeEmail}>
            <label style={{ display: "block", fontSize: 14, color: "#374151" }}>
              Adres email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                marginTop: 4,
                width: "100%",
                padding: 10,
                borderRadius: 8,
                border: "1px solid #d1d5db",
                marginBottom: 8,
              }}
              placeholder="nowy adres email"
            />

            <label style={{ display: "block", fontSize: 13, color: "#6b7280" }}>
              Potwierdź hasłem (obecne hasło)
            </label>
            <input
              type="password"
              value={emailPassword}
              onChange={(e) => setEmailPassword(e.target.value)}
              style={{
                marginTop: 4,
                width: "100%",
                padding: 10,
                borderRadius: 8,
                border: "1px solid #d1d5db",
              }}
              placeholder="obecne hasło"
            />

            <button
              type="submit"
              disabled={changingEmail}
              style={{
                marginTop: 12,
                padding: "10px 16px",
                borderRadius: 8,
                border: "none",
                background: changingEmail ? "#9ca3af" : "#4f46e5",
                color: "#fff",
                cursor: changingEmail ? "default" : "pointer",
                fontWeight: 600,
              }}
            >
              {changingEmail ? "Zapisywanie..." : "Zmień email"}
            </button>

            {emailStatus && (
              <div
                style={{
                  marginTop: 8,
                  padding: 8,
                  borderRadius: 8,
                  fontSize: 13,
                  background: emailStatus.ok ? "#ecfdf3" : "#fef2f2",
                  border: `1px solid ${
                    emailStatus.ok ? "#bbf7d0" : "#fecaca"
                  }`,
                  color: emailStatus.ok ? "#166534" : "#b91c1c",
                }}
              >
                {emailStatus.text}
              </div>
            )}
          </form>
        )}
      </section>

      {/* Sekcja: Zmiana hasła */}
      <section style={{ marginTop: 32 }}>
        <h3 style={{ marginBottom: 8 }}>Zmiana hasła</h3>
        <form onSubmit={handleChangePassword}>
          <label style={{ display: "block", fontSize: 14, color: "#374151" }}>
            Obecne hasło
          </label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            style={{
              marginTop: 4,
              width: "100%",
              padding: 10,
              borderRadius: 8,
              border: "1px solid #d1d5db",
              marginBottom: 8,
            }}
          />

          <label style={{ display: "block", fontSize: 14, color: "#374151" }}>
            Nowe hasło
          </label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            style={{
              marginTop: 4,
              width: "100%",
              padding: 10,
              borderRadius: 8,
              border: "1px solid #d1d5db",
              marginBottom: 8,
            }}
          />

          <label style={{ display: "block", fontSize: 14, color: "#374151" }}>
            Powtórz nowe hasło
          </label>
          <input
            type="password"
            value={newPassword2}
            onChange={(e) => setNewPassword2(e.target.value)}
            style={{
              marginTop: 4,
              width: "100%",
              padding: 10,
              borderRadius: 8,
              border: "1px solid #d1d5db",
              marginBottom: 8,
            }}
          />

          <button
            type="submit"
            disabled={changingPassword}
            style={{
              marginTop: 12,
              padding: "10px 16px",
              borderRadius: 8,
              border: "none",
              background: changingPassword ? "#9ca3af" : "#4b5563",
              color: "#fff",
              cursor: changingPassword ? "default" : "pointer",
              fontWeight: 600,
            }}
          >
            {changingPassword ? "Zapisywanie..." : "Zmień hasło"}
          </button>

          {passwordStatus && (
            <div
              style={{
                marginTop: 8,
                padding: 8,
                borderRadius: 8,
                fontSize: 13,
                background: passwordStatus.ok ? "#ecfdf3" : "#fef2f2",
                border: `1px solid ${
                  passwordStatus.ok ? "#bbf7d0" : "#fecaca"
                }`,
                color: passwordStatus.ok ? "#166534" : "#b91c1c",
              }}
            >
              {passwordStatus.text}
            </div>
          )}
        </form>
      </section>

      {/* Sekcja: Progres */}
      <section style={{ marginTop: 32 }}>
        <h3 style={{ marginBottom: 8, color: "#b91c1c" }}>
          Usuń progres zadań
        </h3>
        <p style={{ marginBottom: 12, color: "#7f1d1d", fontSize: 14 }}>
          Ta operacja usuwa wszystkie informacje o ukończonych zadaniach
          dla Twojego konta. Samo konto i dane logowania pozostają.
        </p>

        <button
          onClick={handleClearProgress}
          disabled={clearingProgress}
          style={{
            padding: "10px 16px",
            borderRadius: 8,
            border: "none",
            background: clearingProgress ? "#9ca3af" : "#dc2626",
            color: "#fff",
            cursor: clearingProgress ? "default" : "pointer",
            fontWeight: 600,
          }}
        >
          {clearingProgress ? "Usuwanie..." : "Usuń mój progres"}
        </button>

        {progressStatus && (
          <div
            style={{
              marginTop: 8,
              padding: 8,
              borderRadius: 8,
              fontSize: 13,
              background: progressStatus.ok ? "#ecfdf3" : "#fef2f2",
              border: `1px solid ${
                progressStatus.ok ? "#bbf7d0" : "#fecaca"
              }`,
              color: progressStatus.ok ? "#166534" : "#b91c1c",
            }}
          >
            {progressStatus.text}
          </div>
        )}
      </section>

      {/* linki na dole */}
      <div
        style={{
          marginTop: 32,
          display: "flex",
          justifyContent: "space-between",
          fontSize: 14,
        }}
      >
        <button
          type="button"
          onClick={() => navigate(-1)}
          style={{
            border: "none",
            background: "transparent",
            color: "#4f46e5",
            cursor: "pointer",
            textDecoration: "underline",
          }}
        >
          ← Wróć
        </button>
        <Link to="/blockly" style={{ color: "#4f46e5" }}>
          Przejdź do zadań →
        </Link>
      </div>
    </div>
  );
}
