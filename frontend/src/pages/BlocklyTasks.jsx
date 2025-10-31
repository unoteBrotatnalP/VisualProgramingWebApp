import React from "react";
import { Link } from "react-router-dom";
import { zadania } from "../data/tasks";

export default function BlocklyTasks() {
  return (
    <div style={{ padding: "1rem" }}>
      <h2>Lista zadań Blockly</h2>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {Object.entries(zadania).map(([id, zadanie]) => (
          <li
            key={id}
            style={{
              margin: "5px 0",
              border: "1px solid #ccc",
              borderRadius: "8px",
              padding: "2px",
              background: "#f8f8f8",
            }}
          >
            <h3 style={{ margin: 0 }}>{zadanie.tytul}</h3>
            <p style={{ margin: "0.5rem 0" }}>{zadanie.desc}</p>
            <Link to={`/blockly/${id}`} style={{ color: "blue" }}>
            Otwórz zadanie
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
