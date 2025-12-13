// App.jsx

import { Link } from "react-router-dom"; // Usunięto 'useNavigate'
import { useState, useEffect } from "react";
import Home from "./pages/Home";

export default function App() {
  // const navigate = useNavigate(); // Usunięto hooka, który powodował błąd

  // Używamy stanu, aby komponent zareagował na zmianę tokena
  const [token, setToken] = useState(localStorage.getItem("token"));

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
  }, []); // Pusta tablica oznacza, że efekt uruchomi się tylko raz przy montowaniu (dodając listener)

  const handleLogout = () => {
    localStorage.removeItem("token"); // usuwa token
    setToken(null); // Aktualizuje stan, aby komponent się odświeżył

    // Zamiast `Maps("/")`, odświeżamy stronę. 
    // Spowoduje to ponowne załadowanie aplikacji od `main.jsx`,
    // co poprawnie odczyta brak tokena i wyświetli widok wylogowany.
    window.location.reload();
  };

  if (!token) {
    return <Home />;
  }

  return (
    <div className="welcome-wrap">
      <div className="welcome-card">
        <h1 className="welcome-title">Witaj ponownie!</h1>
        <p className="info">Cieszymy się, że wróciłeś. Jesteś zalogowany.</p>
        <div className="actions">
          <Link to="/blockly" className="btn primary">
            Przejdź do Blockly
          </Link>
          <button
            onClick={handleLogout}
            className="btn secondary"
            style={{ background: "#fee2e2", borderColor: "#dc2626", color: "#dc2626" }}
          >
            Wyloguj
          </button>
        </div>
      </div>
    </div>
  );
}