import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Header.css";

function Header({ logout }) {
  const navigate = useNavigate();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [userEmail, setUserEmail] = useState(localStorage.getItem("email"));
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));

  // Nasłuchuj zmian tokena w localStorage (np. logowanie/wylogowanie w innej karcie)
  useEffect(() => {
    const handleStorageChange = () => {
      setIsLoggedIn(!!localStorage.getItem("token"));
      setUserEmail(localStorage.getItem("email"));
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Aktualizacja stanu przy każdej zmianie tokena w tej karcie
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
    setUserEmail(localStorage.getItem("email"));
  }, [localStorage.getItem("token")]); 

  const handleNavigate = (path) => {
    navigate(path);
    setUserMenuOpen(false);
  };

  return (
    <header className="header">
      <div className="header-left">
        <button onClick={() => handleNavigate("/")}>Home</button>
        <button onClick={() => handleNavigate("/theory")}>Teoria</button>
        <button onClick={() => handleNavigate("/blockly")}>Blockly</button>
      </div>

      <div className="header-right">
        {isLoggedIn && (
          <div className="user-menu">
            <button
              className="user-icon"
              onClick={() => setUserMenuOpen((prev) => !prev)}
            >
              Tu bedzie jakas ikonka
            </button>
            {userMenuOpen && (
              <div className="dropdown">
                <p className="dropdown-user">{userEmail || "Użytkownik"}</p>
                <hr />
                <button onClick={logout}>Wyloguj</button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;