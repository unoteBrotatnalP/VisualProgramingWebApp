import React, { useState, useEffect, useRef } from "react";
import * as Blockly from "blockly";
import "blockly/blocks";
import "./Theory.css";
import * as pl from "blockly/msg/pl";
import { teoria } from "../data/theoryData";
import ReactMarkdown from "react-markdown";

// Komponent do renderowania pojedynczych bloków Blockly
function SingleBlock({ blockXml, description }) {
  const blocklyDiv = useRef(null);
  const workspaceRef = useRef(null);

  useEffect(() => {
    if (!blocklyDiv.current || !blockXml) return;

    Blockly.setLocale(pl);

    // Sprawdź czy workspace już istnieje
    if (workspaceRef.current) {
      workspaceRef.current.dispose();
      workspaceRef.current = null;
    }

    // Wyczyść kontener
    if (blocklyDiv.current) {
      blocklyDiv.current.innerHTML = "";
      blocklyDiv.current.style.minHeight = "80px";
      blocklyDiv.current.style.height = "auto";
      blocklyDiv.current.style.width = "100%";
    }

    try {
      const workspace = Blockly.inject(blocklyDiv.current, {
        readOnly: true,
        scrollbars: false,
        trashcan: false,
        toolbox: null,
        zoom: {
          controls: false,
          wheel: false,
          startScale: 1.0,
        },
        move: {
          scrollbars: false,
          drag: false,
          wheel: false,
        },
        grid: {
          spacing: 20,
          length: 0,
          colour: "#fff",
          snap: false,
        }
      });

      workspaceRef.current = workspace;

      try {
        // Sprawdź czy XML zawiera blok z zmienną i dodaj zmienną do workspace PRZED parsowaniem
        const xmlDom = Blockly.utils.xml.textToDom(blockXml);
        const blocks = xmlDom.getElementsByTagName('block');
        for (let i = 0; i < blocks.length; i++) {
          const block = blocks[i];
          const varFields = block.getElementsByTagName('field');
          for (let j = 0; j < varFields.length; j++) {
            const field = varFields[j];
            if (field.getAttribute('name') === 'VAR') {
              // Pobierz nazwę zmiennej różnymi metodami
              let varName = field.textContent || field.text || field.innerHTML;
              if (!varName && field.firstChild) {
                varName = field.firstChild.nodeValue;
              }
              if (varName && varName.trim()) {
                varName = varName.trim();
                try {
                  // Dodaj zmienną do workspace jeśli jeszcze nie istnieje
                  const variableMap = workspace.getVariableMap();
                  if (!variableMap.getVariable(varName, Blockly.VARIABLE_CATEGORY_NAME)) {
                    workspace.createVariable(varName);
                  }
                } catch (varError) {
                  console.warn("Błąd tworzenia zmiennej:", varError);
                }
              }
            }
          }
        }
        
        Blockly.Xml.domToWorkspace(xmlDom, workspace);
        
        // Poczekaj na renderowanie
        setTimeout(() => {
          if (workspaceRef.current) {
            const blocks = workspaceRef.current.getAllBlocks();
            if (blocks.length > 0) {
              workspace.resizeContents();
              
              // Ustaw rozmiar kontenera na podstawie bloku
              const metrics = workspace.getMetrics();
              if (metrics && metrics.contentHeight > 0) {
                if (blocklyDiv.current) {
                  blocklyDiv.current.style.height = `${metrics.contentHeight + 20}px`;
                }
              }
            }
          }
        }, 100);
      } catch (xmlError) {
        console.error("Błąd parsowania XML:", xmlError);
      }
    } catch (e) {
      console.error("Błąd inicjalizacji workspace:", e);
    }

    return () => {
      if (workspaceRef.current) {
        workspaceRef.current.dispose();
        workspaceRef.current = null;
      }
    };
  }, [blockXml]);

  return (
    <div className="single-block-example">
      <div ref={blocklyDiv} className="blockly-single-block" />
      {description && (
        <div className="block-description">
          <strong>💡 Jak działa:</strong> {description}
        </div>
      )}
    </div>
  );
}

function BlocklyStyleCreateVariable({ label }) {
  return (
    <div className="blockly-create-variable" aria-disabled="true">
      {label || Blockly.Msg.NEW_VARIABLE}
    </div>
  );
}

function VariableButtonPreview({ label, description }) {
  return (
    <div className="single-block-example blockly-variable-preview">
      <div className="blockly-single-block blockly-variable-button-wrapper">
        <BlocklyStyleCreateVariable label={label} />
      </div>

      {description && (
        <div className="block-description">
          <strong>💡 Jak działa:</strong> {description}
        </div>
      )}
    </div>
  );
}

export default function Theory() {
  const [wybranyTemat, setWybranyTemat] = useState("zmienne");
  const temat = teoria[wybranyTemat];

  return (
    <div className="theory-container">
      <div className="theory-header">
        <h1> Teoria</h1>
        {/*<p className="theory-subtitle"> </p>*/}
      </div>

      <div className="theory-content">
        {/* Menu boczne z tematami */}
        <div className="theory-sidebar">
          <h3>Tematy</h3>
          <button
            className={`theory-topic-btn ${wybranyTemat === "zmienne" ? "active" : ""}`}
            onClick={() => setWybranyTemat("zmienne")}
          >
            {/*<span className="topic-icon">📦</span> */}
            <span>Zmienne</span>
          </button>
          <button
            className={`theory-topic-btn ${wybranyTemat === "petle" ? "active" : ""}`}
            onClick={() => setWybranyTemat("petle")}
          >
            <span>Pętle</span>
          </button>
        <button
            className={`theory-topic-btn ${wybranyTemat === "warunki" ? "active" : ""}`}
            onClick={() => setWybranyTemat("warunki")}
          >
            <span>Warunki</span>
          </button>
          </div>

        {/* Główna treść */}
        <div className="theory-main">
          <div className="theory-topic-header">
            <span className="topic-large-icon">{temat.ikona}</span>
            <div>
              <h2>{temat.tytul}</h2>
              <div className="topic-description">
                <ReactMarkdown>{temat.opis}</ReactMarkdown>
              </div>
            </div>
          </div>

          <div className="theory-sections">
            {temat.sekcje.map((sekcja, index) => (
              <div key={index} className="theory-section">
                <h3 className="section-title">{sekcja.naglowek}</h3>
                <div className="section-content">
                  <ReactMarkdown>{sekcja.tresc}</ReactMarkdown>
                </div>
                
                {sekcja.przyklad && (
                  <div className="blockly-examples">
                    <div className="code-header">
                      <span> Przykłady bloków:</span>
                      </div>
                      {sekcja.przyklad.bloki && sekcja.przyklad.bloki.length > 0 ? (
                        sekcja.przyklad.bloki.map((blok, idx) => {

                          if (blok.createVariableButton) {
                            return (
                              <VariableButtonPreview
                                key={idx}
                                label={blok.createVariableButton.label}
                                description={blok.opis}
                              />
                            );
                          }

                          return (
                            <SingleBlock
                              key={idx}
                              blockXml={blok.xml}
                              description={blok.opis}
                            />
                          );
                        })

                      ) : sekcja.przyklad.blocklyXml ? (
                        // Fallback dla starych przykładów
                        <div className="blockly-example">
                          <SingleBlock
                            blockXml={sekcja.przyklad.blocklyXml}
                            description={sekcja.przyklad.wyjasnienie}
                          />
                        </div>
                      ) : null}

                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="theory-footer">
          </div>
        </div>
      </div>
    </div>
  );
}
