// App.jsx

import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Home from "./pages/Home";
import { useUser } from "./context/UserContext";
import "./pages/Home.css";

export default function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const { user, logout } = useUser();

  // Efekt do sprawdzania tokena przy montowaniu ORAZ
  // do nasłuchiwania na zmiany w localStorage (np. logowanie/wylogowanie w innej karcie)
  useEffect(() => {
    const handleStorageChange = () => {
      setToken(localStorage.getItem("token"));
    };

    // Sprawdź przy ładowaniu
    handleStorageChange();

    // Nasłuchuj na przyszłe zmiany
    window.addEventListener('storage', handleStorageChange);

    // Sprzątanie po odmontowaniu
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleLogout = () => {
    logout();
  };

  if (!token) {
    return <Home />;
  }

  return (
    <div className="home-container">
      <main className="hero-section">
        <h1 className="hero-title">
          Witaj z powrotem!
        </h1>

        <p className="hero-subtitle">
          Cieszymy się, że wróciłeś! Jesteś zalogowany i możesz kontynuować naukę programowania.

        </p>

        <div className="hero-actions">
          <Link to="/blockly" className="btn-hero-primary">
            Przejdź do Blockly
          </Link>
          <Link to="/theory" className="btn-hero-primary" style={{ background: "#10b981" }}>
            Teoria
          </Link>
        </div>
      </main>

      <footer className="home-footer">
        Projekt inżynierski 2025/2026
      </footer>
    </div>
  );
}