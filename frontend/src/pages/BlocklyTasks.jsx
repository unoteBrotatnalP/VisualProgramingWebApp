import React, { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { zadania } from "../data/tasks";
import { setAuthToken } from "../lib/api";
import api from "../lib/api";
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
    nazwa: "Instrukcje warunkowe",
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
  const [completed, setCompleted] = useState(new Set());

  useEffect(() => {
    const currentToken = localStorage.getItem("token");
    setToken(currentToken);

    if (!currentToken) {
      setCompleted(new Set());
      return;
    }

    api
      .get("/progress")
      .then((res) => {
        const list = res.data?.completed || [];
        setCompleted(new Set(list));
      })
      .catch((e) => {
        console.error("PROGRESS_FETCH_ERROR", e);
      });
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
        const numA = parseInt(a.id.split("_")[1]) || 0;
        const numB = parseInt(b.id.split("_")[1]) || 0;
        return numA - numB;
      });

    return wynik;
  }, [wybranaKategoria]);

  const kategoria = kategorie[wybranaKategoria];

  const totalInCat = zadaniaWKategorii.length;
  const doneInCat = zadaniaWKategorii.filter((z) => completed.has(z.id)).length;
  const percent = totalInCat ? Math.round((doneInCat / totalInCat) * 100) : 0;

  return (
    <div className="tasks-container">
      <div className="tasks-header">
        <h1>Zadania Blockly</h1>
      </div>

      <div className="tasks-content">
        {/* Menu boczne z kategoriami */}
        <div className="tasks-sidebar">
          <h3>Kategorie</h3>
          {Object.entries(kategorie).map(([key, kat]) => {
            const catTasks = Object.entries(zadania).filter(([_, z]) => z.kategoria === key);
            const isCatDone = catTasks.length > 0 && catTasks.every(([id, _]) => completed.has(id));

            return (
              <button
                key={key}
                className={`tasks-category-btn ${wybranaKategoria === key ? "active" : ""
                  } ${isCatDone ? "completed" : ""}`}
                onClick={() => setWybranaKategoria(key)}
              >
                <span>{kat.nazwa}</span>
              </button>
            );
          })}
        </div>

        {/* Główna treść */}
        <div className="tasks-main">
          <div className="tasks-category-header">
            <div>
              <h2>{kategoria.nazwa}</h2>
              <div className="category-description">{kategoria.opis}</div>
            </div>
          </div>

          {/* Pasek progresu dla wybranej kategorii */}
          <div className="tasks-progress-bar">
            <div className="tasks-progress-info">
              Ukończono: {doneInCat} / {totalInCat} ({percent}%)
            </div>
            <div className="tasks-progress-track">
              <div
                className="tasks-progress-fill"
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>

          <div className="tasks-grid">
            {zadaniaWKategorii.map((zadanie, index) => {
              const isDone = completed.has(zadanie.id);
              return (
                <div
                  key={zadanie.id}
                  className={`task-card ${isDone ? "task-card--done" : ""
                    } ${!token ? "disabled" : ""}`}
                >
                  <div className="task-header">
                    <h3 className="task-title">{zadanie.tytul}</h3>
                    {isDone && (
                      <span className="task-pill">Ukończone ✔</span>
                    )}
                  </div>
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
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
