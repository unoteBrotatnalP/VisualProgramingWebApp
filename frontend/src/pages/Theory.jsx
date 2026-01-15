import React, { useState, useEffect, useRef } from "react";
import * as Blockly from "blockly";
import "blockly/blocks";
import "./Theory.css";
import * as pl from "blockly/msg/pl";
import { teoria } from "../data/theoryData";
import ReactMarkdown from "react-markdown";
import api from "../lib/api"; // Import active API client
import { useUser } from "../context/UserContext";

// Funkcja do czyszczenia XML z niepotrzebnych atrybutów (id, x, y)
function cleanBlocklyXml(xmlString) {
  try {
    // Napraw typowe błędy w XML (np. <bloc> zamiast <block>)
    let cleaned = xmlString;
    cleaned = cleaned.replace(/<bloc\b/gi, '<block');
    cleaned = cleaned.replace(/<\/bloc>/gi, '</block>');

    const xmlDom = Blockly.utils.xml.textToDom(cleaned);

    // Usuń atrybuty id, x, y ze wszystkich elementów <block>
    const blocks = xmlDom.getElementsByTagName('block');
    for (let i = 0; i < blocks.length; i++) {
      const block = blocks[i];
      block.removeAttribute('id');
      block.removeAttribute('x');
      block.removeAttribute('y');
    }

    // Usuń atrybuty id z elementów <variable>
    const variables = xmlDom.getElementsByTagName('variable');
    for (let i = 0; i < variables.length; i++) {
      const variable = variables[i];
      variable.removeAttribute('id');
    }

    // Usuń atrybuty id z elementów <field>
    const fields = xmlDom.getElementsByTagName('field');
    for (let i = 0; i < fields.length; i++) {
      const field = fields[i];
      field.removeAttribute('id');
    }

    // Konwertuj z powrotem do stringa
    return Blockly.utils.xml.domToText(xmlDom);
  } catch (error) {
    console.warn("Błąd czyszczenia XML, używam oryginalnego:", error);
    return xmlString;
  }
}

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
        sounds: false,
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
        // Wyczyść XML z niepotrzebnych atrybutów (id, x, y)
        const cleanedXml = cleanBlocklyXml(blockXml);

        // Sprawdź czy XML zawiera blok z zmienną i dodaj zmienną do workspace PRZED parsowaniem
        const xmlDom = Blockly.utils.xml.textToDom(cleanedXml);
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
  const { user } = useUser();
  const [wybranyTemat, setWybranyTemat] = useState("zmienne");
  const [completedTopics, setCompletedTopics] = useState([]); // List of learned topics
  const [loading, setLoading] = useState(false);

  const temat = teoria[wybranyTemat];
  const topicId = `theory_${wybranyTemat}`;
  const isCompleted = completedTopics.includes(topicId);

  // Fetch progress on mount - only if user is logged in
  useEffect(() => {
    if (user) {
      fetchProgress();
    }
  }, [user]);

  const fetchProgress = async () => {
    try {
      // api instance automatically handles baseURL (4000) and Authorization header
      const { data } = await api.get("/progress");
      if (data.completed) {
        setCompletedTopics(data.completed);
      }
    } catch (err) {
      // Only log error if it's not a 401 (unauthorized) - user might not be logged in
      if (err.response?.status !== 401) {
        console.error("Error fetching progress:", err);
      }
    }
  };

  const handleToggleProgress = async () => {
    if (!user) {
      alert("Musisz być zalogowany, aby oznaczać postęp. Przekierowuję do strony logowania...");
      window.location.href = "/login";
      return;
    }

    setLoading(true);
    try {
      if (isCompleted) {
        // Unmark (DELETE)
        await api.delete(`/progress/${topicId}`);
        setCompletedTopics(prev => prev.filter(id => id !== topicId));
      } else {
        // Mark (POST)
        await api.post(`/progress/${topicId}/complete`);
        setCompletedTopics(prev => [...prev, topicId]);
      }
    } catch (err) {
      console.error("Error toggling progress:", err);
      // More specific error message if available
      const msg = err.response?.data?.message || "Wystąpił błąd podczas zapisywania postępu.";
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  const getButtonClass = (key) => {
    const isActive = wybranyTemat === key;
    const isLearned = completedTopics.includes(`theory_${key}`);

    let cls = "theory-topic-btn";
    if (isActive) cls += " active";
    if (isLearned) cls += " learned"; // You'll need to style this class
    return cls;
  };

  return (
    <div className="theory-container">
      <div className="theory-header">
        <h1>🎓 Teoria i Nauka</h1>
      </div>

      <div className="theory-content">
        {/* Menu boczne z tematami */}
        <div className="theory-sidebar">
          <h3>Tematy</h3>
          {Object.keys(teoria).map(key => (
            <button
              key={key}
              className={getButtonClass(key)}
              onClick={() => setWybranyTemat(key)}
            >
              <span>{teoria[key].tytul}</span>
            </button>
          ))}
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
                    ) : null}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="theory-footer" style={{ marginTop: 40, borderTop: "1px solid #eee", paddingTop: 20 }}>
            {!user && (
              <div style={{ marginBottom: 10, color: "#6b7280", fontSize: 14 }}>
                💡 Zaloguj się, aby oznaczać postęp w nauce
              </div>
            )}
            <button
              onClick={handleToggleProgress}
              disabled={loading || !user}
              style={{
                background: isCompleted ? "#fee2e2" : "#d1fae5",
                color: isCompleted ? "#991b1b" : "#065f46",
                border: isCompleted ? "1px solid #fca5a5" : "1px solid #6ee7b7",
                padding: "12px 24px",
                borderRadius: "8px",
                fontSize: "16px",
                fontWeight: "600",
                cursor: user && !loading ? "pointer" : "not-allowed",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                transition: "all 0.2s",
                opacity: user ? 1 : 0.6
              }}
            >
              {isCompleted ? (
                <>
                  Oznacz jako nieopanowane ❌
                </>
              ) : (
                <>
                  🎓 Oznacz jako nauczone (Umiem to!)
                </>
              )}
            </button>
            {isCompleted && (
              <div style={{ marginTop: 10, color: "#10b981", fontSize: 14 }}>
                Status: Materiał opanowany! Dobra robota.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
