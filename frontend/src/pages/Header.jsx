import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { User, Settings, LogOut, ChevronDown } from "lucide-react";
import "./Header.css";

function Header() {
  const navigate = useNavigate();
  const { user, logout } = useUser();
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleNavigate = (path) => {
    navigate(path);
    setUserMenuOpen(false);
  };

  const goToSettings = () => {
    setUserMenuOpen(false);
    navigate("/settings");
  };

  return (
    <header className="header">
      <div className="header-left">
        <button onClick={() => handleNavigate("/")}>Home</button>
        <button onClick={() => handleNavigate("/theory")}>Teoria</button>
        <button onClick={() => handleNavigate("/blockly")}>Blockly</button>
      </div>

      <div className="header-right">
        {user ? (
          <div className="user-menu-container">
            <button
              className={`user-btn ${userMenuOpen ? "active" : ""}`}
              onClick={() => setUserMenuOpen((prev) => !prev)}
            >
              <div className="user-avatar">
                <User size={20} />
              </div>
              <ChevronDown size={16} className={`chevron ${userMenuOpen ? "rotate" : ""}`} />
            </button>

            {userMenuOpen && (
              <div className="user-dropdown">
                <div className="user-info">
                  <p className="user-name">Cześć, {user.first_name || "Użytkowniku"}</p>
                  <p className="user-email">{user.email}</p>
                </div>
                <div className="dropdown-divider" />
                <button onClick={goToSettings} className="dropdown-item">
                  <Settings size={16} />
                  <span>Ustawienia</span>
                </button>
                <button onClick={logout} className="dropdown-item logout">
                  <LogOut size={16} />
                  <span>Wyloguj</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <button className="login-btn" onClick={() => navigate("/login")}>
            Zaloguj się
          </button>
        )}
      </div>
    </header>
  );
}

export default Header;