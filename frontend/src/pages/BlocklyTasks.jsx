import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { zadania } from "../data/tasks";
import { setAuthToken } from "../lib/api";

export default function BlocklyTasks() {
  const navigate = useNavigate();
  const [token, setToken] = useState(localStorage.getItem("token"));

  useEffect(() => {
    const currentToken = localStorage.getItem("token");
    setToken(currentToken);
  }, []);

  return (
    <div style={{ padding: "1rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2>Lista zadań Blockly</h2>
      </div>

      <ul style={{ listStyle: "none", padding: 0 }}>
        {Object.entries(zadania).map(([id, zadanie]) => (
          <li
            key={id}
            style={{
              margin: "5px 0",
              border: "1px solid #ccc",
              borderRadius: "8px",
              padding: "8px",
              background: "#f8f8f8",
            }}
          >
            <h3 style={{ margin: 0 }}>{zadanie.tytul}</h3>
            <p style={{ margin: "0.5rem 0" }}>{zadanie.opis}</p>

            {token ? (
              <Link to={`/blockly/${id}`} style={{ color: "blue" }}>
                Otwórz zadanie
              </Link>
            ) : (
              <span style={{ color: "gray", cursor: "not-allowed" }}>
                 Zaloguj się, aby otworzyć
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
