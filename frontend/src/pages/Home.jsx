import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Home.css";

export default function Home() {
    const [token, setToken] = useState(localStorage.getItem("token"));

    useEffect(() => {
        const handleStorageChange = () => {
            setToken(localStorage.getItem("token"));
        };

        handleStorageChange();
        window.addEventListener("storage", handleStorageChange);

        return () => {
            window.removeEventListener("storage", handleStorageChange);
        };
    }, []);

    if (token) {
        return (
            <div className="home-container">
                <main className="hero-section">
                    <h1 className="hero-title">Witaj z powrotem!</h1>

                    <p className="hero-subtitle">
                        Cieszymy się, że wróciłeś! Jesteś zalogowany i możesz kontynuować
                        naukę programowania.
                    </p>

                    <div className="hero-actions">
                        <Link to="/blockly" className="btn-hero-primary">
                            Przejdź do Blockly
                        </Link>
                        <Link
                            to="/theory"
                            className="btn-hero-primary"
                            style={{ background: "#10b981" }}
                        >
                            Teoria
                        </Link>
                    </div>
                </main>

                <footer className="home-footer">Projekt inżynierski 2025/2026</footer>
            </div>
        );
    }

    return (
        <div className="home-container">
            {/* Navbar globalny w main.jsx, brak lokalnego nagłówka */}

            <main className="hero-section">
                <h1 className="hero-title">
                    Wirtualna Szkoła
                    <br />
                    programowania dla dzieci
                </h1>

                <p className="hero-subtitle">
                    Proste narzędzie do nauki logiki. Przeciągaj bloki, buduj algorytmy i
                    zobacz, jak działa kod bez pisania ani jednej linijki tekstu.
                </p>

                <div className="hero-actions">
                    <Link to="/register" className="btn-hero-primary">
                        Zacznij tutaj
                    </Link>
                </div>

                {/* Proste cechy - ikony i czysty tekst */}
                <div className="features-simple">
                    <div className="feature-item">
                        <div className="feature-icon">🧩</div>
                        <span className="feature-text">Układaj</span>
                    </div>
                    <div className="feature-item">
                        <div className="feature-icon">⚡</div>
                        <span className="feature-text">Działaj</span>
                    </div>
                    <div className="feature-item">
                        <div className="feature-icon">🎓</div>
                        <span className="feature-text">Ucz się</span>
                    </div>
                </div>
            </main>

            <footer className="home-footer">Projekt inżynierski 2025/2026</footer>
        </div>
    );
}
