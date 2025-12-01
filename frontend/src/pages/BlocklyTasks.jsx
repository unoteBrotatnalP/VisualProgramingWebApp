import React, { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { zadania } from "../data/tasks";
import { setAuthToken } from "../lib/api";
import "./BlocklyTasks.css";

const kategorie = {
  zmienne: {
    id: "zmienne",
    nazwa: "Zmienne",
    opis: "Naucz się używać zmiennych do przechowywania informacji",
  },
  petle: {
    id: "petle",
    nazwa: "Pętle",
    opis: "Poznaj różne typy pętli: FOR, WHILE i powtórz",
  },
  warunki: {
    id: "warunki",
    nazwa: "Warunki",
    opis: "Naucz się podejmować decyzje w programach",
  },
  tekst: {
    id: "tekst",
    nazwa: "Tekst",
    opis: "Pracuj z tekstem i łącz słowa",
  },
  matematyczne: {
    id: "matematyczne",
    nazwa: "Matematyczne",
    opis: "Wykonuj obliczenia matematyczne",
  },
  kombinowane: {
    id: "kombinowane",
    nazwa: "Kombinowane",
    opis: "Połącz różne koncepcje w jednym zadaniu",
  },
  graficzne: {
    id: "graficzne",
    nazwa: "Graficzne",
    opis: "Twórz grafiki i animacje na scenie",
  },
};

export default function BlocklyTasks() {
  const navigate = useNavigate();
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [wybranaKategoria, setWybranaKategoria] = useState("zmienne");

  useEffect(() => {
    const currentToken = localStorage.getItem("token");
    setToken(currentToken);
  }, []);

  const zadaniaWKategorii = useMemo(() => {
    const kategoria = kategorie[wybranaKategoria];
    if (!kategoria) return [];

    // Filtruj zadania po kategorii
    const wynik = Object.entries(zadania)
      .filter(([id, zadanie]) => zadanie.kategoria === kategoria.id)
      .map(([id, zadanie]) => ({ id, ...zadanie }))
      .sort((a, b) => {
        // Sortuj po numerze w ID (np. zmienne_1, zmienne_2)
        const numA = parseInt(a.id.split('_')[1]) || 0;
        const numB = parseInt(b.id.split('_')[1]) || 0;
        return numA - numB;
      });
    
    return wynik;
  }, [wybranaKategoria]);

  const kategoria = kategorie[wybranaKategoria];

  return (
    <div className="tasks-container">
      <div className="tasks-header">
        <h1>Zadania Blockly</h1>
      </div>

      <div className="tasks-content">
        {/* Menu boczne z kategoriami */}
        <div className="tasks-sidebar">
          <h3>Kategorie</h3>
          {Object.entries(kategorie).map(([key, kat]) => (
            <button
              key={key}
              className={`tasks-category-btn ${wybranaKategoria === key ? "active" : ""}`}
              onClick={() => setWybranaKategoria(key)}
            >
              <span>{kat.nazwa}</span>
            </button>
          ))}
        </div>

        {/* Główna treść */}
        <div className="tasks-main">
          <div className="tasks-category-header">
            <div>
              <h2>{kategoria.nazwa}</h2>
              <div className="category-description">{kategoria.opis}</div>
            </div>
          </div>

          <div className="tasks-grid">
            {zadaniaWKategorii.map((zadanie, index) => (
              <div
                key={zadanie.id}
                className={`task-card ${!token ? "disabled" : ""}`}
              >
                <h3 className="task-title">{zadanie.tytul}</h3>
                <p className="task-description">{zadanie.opis}</p>

                {token ? (
                  <Link
                    to={`/blockly/${zadanie.id}`}
                    className="task-link"
                    onClick={(e) => {
                      if (!token) {
                        e.preventDefault();
                      }
                    }}
                  >
                    Otwórz zadanie →
                  </Link>
                ) : (
                  <span className="task-disabled-text">
                    Zaloguj się, aby otworzyć
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
