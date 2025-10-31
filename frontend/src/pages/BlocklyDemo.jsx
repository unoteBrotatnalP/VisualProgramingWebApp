import React, { useEffect, useRef, useState } from "react";
import * as Blockly from "blockly";
import { javascriptGenerator } from "blockly/javascript";
import { useParams, Link } from "react-router-dom";
import { zadania } from "../data/tasks";


javascriptGenerator.forBlock['text_print'] = function(block, generator) {
  const msg = generator.valueToCode(block, 'TEXT', generator.ORDER_NONE) || "''";
  return `print(${msg});\n`;
};

export default function BlocklyDemo() {
  const {id} = useParams(); // pobieranie numeru zdania z url
  const zadanie = zadania[id] || { tytul: "Nieznane zadanie", desc: "" };

  const blocklyDiv = useRef(null);
  const workspaceRef = useRef(null);
  const [output, setOutput] = useState(""); // stan do wyświetlania wyników

  useEffect(() => {
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

    const workspace = Blockly.inject(blocklyDiv.current, {
      toolbox: toolbox,
      trashcan: true,
    });

    workspaceRef.current = workspace;

    return () => workspace.dispose();
  }, [id]); //odswiezenia po zmianianie zadania

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

    const print = (msg) => {
      outputBuffer.push(msg);
    };

    const wrappedCode = new Function("print", code);


    wrappedCode(print);

    if (outputBuffer.length > 0) {
      setOutput(outputBuffer.join("\n"));
    } else {
      setOutput("(Brak danych do wyświetlenia)");
    }

  } catch (e) {
    setOutput("Błąd: " + e.message);
  }
};


  return (
    <div style={{ padding: "1px" }}>
      <Link to="/blockly" style={{ textDecoration: "none", color: "blue" }}>
        ← Powrót do listy zadań
      </Link>

      <h2 style={{ marginTop: "1rem", marginLeft: "10px", }}>{zadanie.tytul}</h2>

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
