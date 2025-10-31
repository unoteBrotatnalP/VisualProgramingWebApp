import React, { useEffect, useRef, useState } from "react";
import * as Blockly from "blockly";
import { javascriptGenerator } from "blockly/javascript";
import { useNavigate, useParams, Link } from "react-router-dom";
import { setAuthToken } from "../lib/api";
import { zadania } from "../data/tasks"; // ✅ teraz korzysta z tasks.js
import "./BlocklyDemo.css";

javascriptGenerator.forBlock["text_print"] = function (block, generator) {
  const msg = generator.valueToCode(block, "TEXT", generator.ORDER_NONE) || "''";
  return `print(${msg});\n`;
};

export default function BlocklyDemo() {
  const { id } = useParams();
  const zadanie = zadania[id] || { tytul: "Nieznane zadanie", opis: "" };

  const blocklyDiv = useRef(null);
  const workspaceRef = useRef(null);
  const [output, setOutput] = useState("");
  const navigate = useNavigate();
  const [token, setToken] = useState(localStorage.getItem("token"));

  useEffect(() => {
    const currentToken = localStorage.getItem("token");
    setToken(currentToken);

    const toolbox = {
      kind: "categoryToolbox",
      contents: [
        {
          kind: "category",
          name: "Logic",
          categorystyle: "logic_category",
          contents: [
            { kind: "block", type: "controls_if" },
            { kind: "block", type: "logic_compare" },
            { kind: "block", type: "logic_operation" },
            { kind: "block", type: "logic_negate" },
            { kind: "block", type: "logic_boolean" },
          ],
        },
        {
          kind: "category",
          name: "Loops",
          categorystyle: "loop_category",
          contents: [
            {
              kind: "block",
              type: "controls_repeat_ext",
              inputs: {
                TIMES: {
                  block: {
                    type: "math_number",
                    fields: { NUM: 10 },
                  },
                },
              },
            },
            { kind: "block", type: "controls_whileUntil" },
            { kind: "block", type: "controls_for" },
          ],
        },
        {
          kind: "category",
          name: "Math",
          categorystyle: "math_category",
          contents: [
            { kind: "block", type: "math_number", fields: { NUM: 123 } },
            { kind: "block", type: "math_arithmetic" },
            { kind: "block", type: "math_single" },
          ],
        },
        {
          kind: "category",
          name: "Text",
          categorystyle: "text_category",
          contents: [
            { kind: "block", type: "text" },
            { kind: "block", type: "text_length" },
            { kind: "block", type: "text_print" },
          ],
        },
        {
          kind: "category",
          name: "Variables",
          categorystyle: "variable_category",
          custom: "VARIABLE",
        },
      ],
    };

    if (blocklyDiv.current && !workspaceRef.current) {
      const workspace = Blockly.inject(blocklyDiv.current, {
        toolbox: toolbox,
        trashcan: true,
      });
      workspaceRef.current = workspace;
    }

    return () => {
      if (workspaceRef.current) {
        workspaceRef.current.dispose();
        workspaceRef.current = null;
      }
    };
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    if (typeof setAuthToken === "function") setAuthToken(null);
    navigate("/login");
  };

  const showCode = () => {
    const workspace = workspaceRef.current;
    if (!workspace) return alert("Brak workspace!");
    const code = javascriptGenerator.workspaceToCode(workspace);
    alert(code);
  };

  const runCode = () => {
    const workspace = workspaceRef.current;
    if (!workspace) return alert("Brak workspace!");

    try {
      const code = javascriptGenerator.workspaceToCode(workspace);
      let outputBuffer = [];
      const print = (msg) => outputBuffer.push(msg);
      const wrappedCode = new Function("print", code);
      wrappedCode(print);
      setOutput(outputBuffer.length > 0 ? outputBuffer.join("\n") : "(Brak danych do wyświetlenia)");
    } catch (e) {
      setOutput("Błąd: " + e.message);
    }
  };

  return (
    <div style={{ padding: "1px" }}>
      <Link to="/blockly" style={{ textDecoration: "none", color: "blue" }}>
        ← Powrót do listy zadań
      </Link>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2 style={{ marginTop: "1rem", marginLeft: "10px" }}>{zadanie.tytul}</h2>
        {token && (
          <button onClick={logout} className="blockly-auth-btn logout" style={{ marginRight: "10px" }}>
            Wyloguj
          </button>
        )}
      </div>

      <div
        style={{
          background: "#eef6ff",
          border: "1px solid #bcd4ff",
          borderRadius: "2px",
          padding: "1px",
          marginBottom: "5px",
          marginLeft: "10px",
          textAlign: "left",
        }}
      >
        <strong>Polecenie:</strong>
        <p style={{ marginTop: "0.5rem" }}>{zadanie.opis}</p>
      </div>

      <p>
        <button onClick={showCode}>Pokaż kod JS</button>
        <button onClick={runCode}>Uruchom kod</button>
      </p>

      <div
        ref={blocklyDiv}
        style={{
          float: "left",
          height: "480px",
          width: "49%",
          border: "1px solid #ccc",
          marginTop: "1rem",
        }}
      ></div>

      <div
        style={{
          float: "left",
          marginTop: "1rem",
          width: "40%",
          border: "1px solid #ddd",
          background: "#f9f9f9",
          whiteSpace: "pre-wrap",
          overflow: "scroll",
          height: "480px",
          fontFamily: "monospace",
        }}
      >
        <strong>Wynik:</strong>
        <br />
        {output}
      </div>
    </div>
  );
}
