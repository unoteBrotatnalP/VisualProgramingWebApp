import React, { useEffect, useRef, useState } from "react";
import * as Blockly from "blockly";
import "blockly/blocks";
import { javascriptGenerator } from "blockly/javascript";
import { useNavigate, useParams, Link } from "react-router-dom";
import { setAuthToken } from "../lib/api";
import { zadania } from "../data/tasks";
import { validateTaskByXml } from "../lib/xmlValidation";
import "./BlocklyDemo.css";
import * as pl from "blockly/msg/pl";
import api from "../lib/api";
import VariableKom from "../components/VariableKom";

export default function BlocklyDemo() {
  const { id } = useParams();
  const zadanie = zadania[id] || { tytul: "Nieznane zadanie", opis: "" };

  const blocklyDiv = useRef(null);
  const workspaceRef = useRef(null);

  const [output, setOutput] = useState("(Konsola pusta)");

  const navigate = useNavigate();
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [isVariableKomOpen, setIsVariableKomOpen] = useState(false);
  const variableModalCallbackRef = useRef(null);
  const variableModalDefaultValueRef = useRef("");
  const variableModalTypeRef = useRef("create");
  const originalBlocklyPromptRef = useRef(null);
  const originalWindowPromptRef = useRef(null);

  // ======= [NOWE] Auto-save helpers =======
  const saveTimerRef = useRef(null);
  const lastSavedRef = useRef(""); // prosty „hash” string dla ograniczenia zapisów

  const decodeJwtPayload = (jwt) => {
    try {
      if (!jwt) return null;
      const parts = String(jwt).split(".");
      if (parts.length < 2) return null;
      const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
      const json = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );
      return JSON.parse(json);
    } catch {
      return null;
    }
  };

  const getWorkspaceStorageKey = () => {
    // per zadanie + per user (sub/email z tokena); fallback: anon
    const t = localStorage.getItem("token");
    const payload = decodeJwtPayload(t);
    const userKey = payload?.sub || payload?.email || "anon";
    return `vpw_blockly_workspace_${userKey}_${id || "no_task"}`;
  };

  const serializeWorkspace = (ws) => {
    // Prefer nowy serializer (Blockly v9+), fallback do XML
    try {
      if (Blockly?.serialization?.workspaces?.save) {
        const state = Blockly.serialization.workspaces.save(ws);
        return JSON.stringify({ v: 2, state });
      }
    } catch (e) {
      // fallback niżej
    }
    try {
      const dom = Blockly.Xml.workspaceToDom(ws);
      const text = Blockly.Xml.domToText(dom);
      return JSON.stringify({ v: 1, xml: text });
    } catch {
      return "";
    }
  };

  const loadWorkspaceFromString = (ws, str) => {
    if (!str) return false;
    try {
      const parsed = JSON.parse(str);
      if (parsed?.v === 2 && parsed?.state && Blockly?.serialization?.workspaces?.load) {
        ws.clear();
        Blockly.serialization.workspaces.load(parsed.state, ws);
        return true;
      }
      if (parsed?.v === 1 && parsed?.xml) {
        ws.clear();
        const dom = Blockly.Xml.textToDom(parsed.xml);
        Blockly.Xml.domToWorkspace(dom, ws);
        return true;
      }
    } catch {
      // ignore
    }
    return false;
  };

  const saveWorkspaceToLocalStorage = () => {
    const ws = workspaceRef.current;
    if (!ws) return;

    const key = getWorkspaceStorageKey();
    const data = serializeWorkspace(ws);
    if (!data) return;

    // ogranicz zbędne zapisy
    if (data === lastSavedRef.current) return;
    lastSavedRef.current = data;

    try {
      localStorage.setItem(key, data);
    } catch (e) {
      // localStorage full / blocked
      console.warn("WORKSPACE_SAVE_ERROR", e);
    }
  };

  const loadWorkspaceFromLocalStorage = () => {
    const ws = workspaceRef.current;
    if (!ws) return;

    const key = getWorkspaceStorageKey();
    const raw = localStorage.getItem(key);
    if (!raw) return;

    const ok = loadWorkspaceFromString(ws, raw);
    if (ok) {
      lastSavedRef.current = raw;
    }
  };

  const clearWorkspaceFromLocalStorage = () => {
    const key = getWorkspaceStorageKey();
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.warn("WORKSPACE_CLEAR_STORAGE_ERROR", e);
    }
  };

  // [NOWE] Reset workspace (usuwa zapis + czyści)
  const resetWorkspace = () => {
    const ws = workspaceRef.current;
    if (!ws) return;
    try {
      ws.clear();
      clearWorkspaceFromLocalStorage();
      lastSavedRef.current = "";
      setOutput("(Konsola pusta)");
    } catch (e) {
      console.warn("RESET_WORKSPACE_ERROR", e);
    }
  };

  // [NOWE] Undo / Redo
  const undoWorkspace = () => {
    const ws = workspaceRef.current;
    if (!ws) return;
    try {
      ws.undo(false);
    } catch (e) {
      console.warn("UNDO_ERROR", e);
    }
  };

  const redoWorkspace = () => {
    const ws = workspaceRef.current;
    if (!ws) return;
    try {
      ws.undo(true);
    } catch (e) {
      console.warn("REDO_ERROR", e);
    }
  };

  // helper do zapisywania progresu
  const markTaskCompleted = async () => {
    if (!id) return;
    if (!token) return; // nie ma sensu pytać backendu bez zalogowania
    try {
      // Pobierz kategorię i wszystkie ID zadań z tej kategorii
      const category = zadanie.kategoria;
      const categoryTaskIds = Object.entries(zadania)
        .filter(([taskId, task]) => task.kategoria === category)
        .map(([taskId]) => taskId);

      await api.post(`/progress/${id}/complete`, {
        category,
        categoryTaskIds,
      });
      // Wywołaj event, aby odświeżyć moduł postępu w Header
      window.dispatchEvent(new CustomEvent("progressUpdated"));
      // Wywołaj event, aby odświeżyć puchary
      window.dispatchEvent(new CustomEvent("trophiesUpdated"));
    } catch (e) {
      console.error("PROGRESS_SAVE_ERROR", e);
    }
  };

  // Nadpisujemy prompt na samym początku, przed utworzeniem workspace
  useEffect(() => {
    // Zapisz oryginalne funkcje prompt
    if (originalBlocklyPromptRef.current === null) {
      originalBlocklyPromptRef.current = Blockly.prompt;
      originalWindowPromptRef.current = window.prompt;
    }

    // Funkcja do obsługi prompta
    const customPrompt = (message, defaultValue, callback) => {
      const messageStr = String(message || "").toLowerCase();
      const hasDefaultValue =
        defaultValue && String(defaultValue).trim().length > 0;

      // Wykrywanie zmiany nazwy - komunikat zawiera "zmień nazwy" lub "zmień nazwę"
      const isVariableRename =
        messageStr.includes("zmień nazwy") ||
        messageStr.includes("zmien nazwy") ||
        messageStr.includes("zmień nazwę") ||
        messageStr.includes("zmien nazwe") ||
        messageStr.includes("rename") ||
        messageStr.includes("nowa nazwa zmiennej") ||
        (hasDefaultValue &&
          (messageStr.includes("zmiennych") ||
            messageStr.includes("zmiennej") ||
            messageStr.includes("variable")));

      // Wykrywanie tworzenia nowej zmiennej
      const isVariableCreation =
        !isVariableRename &&
        (messageStr.includes("zmienną") ||
          messageStr.includes("zmiennej") ||
          messageStr.includes("variable") ||
          messageStr.includes("new_variable") ||
          messageStr.includes("nowa nazwa"));

      if (isVariableCreation || isVariableRename) {
        // To jest żądanie utworzenia lub zmiany nazwy zmiennej - pokazujemy nasz modal
        // Dla zmiany nazwy, wyciągnij nazwę zmiennej z komunikatu (tekst w cudzysłowach)
        let variableNameToRename = defaultValue || "";
        if (isVariableRename && message) {
          // Szukamy tekstu w cudzysłowach: "Zmień nazwy wszystkich 'Siema' zmiennych na:"
          const match = message.match(/['"]([^'"]+)['"]/);
          if (match && match[1]) {
            variableNameToRename = match[1];
          }
        }

        variableModalCallbackRef.current = callback;
        variableModalDefaultValueRef.current = variableNameToRename;
        variableModalTypeRef.current = isVariableRename ? "rename" : "create";
        setIsVariableKomOpen(true);
        return null; // Blokujemy domyślny prompt
      } else {
        // Dla innych promptów używamy oryginalnej funkcji
        if (
          originalBlocklyPromptRef.current &&
          typeof originalBlocklyPromptRef.current === "function"
        ) {
          return originalBlocklyPromptRef.current(
            message,
            defaultValue,
            callback
          );
        } else if (originalWindowPromptRef.current) {
          try {
            const result = originalWindowPromptRef.current.call(
              window,
              message,
              defaultValue
            );
            if (callback && typeof callback === "function") {
              callback(result);
            }
            return result;
          } catch (e) {
            return null;
          }
        }
        return null;
      }
    };

    // Nadpisz Blockly.prompt
    try {
      if (Blockly.prompt !== undefined) {
        if (Object.isExtensible(Blockly)) {
          Blockly.dialog.setPrompt(customPrompt);
        } else {
          try {
            Object.defineProperty(Blockly, "prompt", {
              value: customPrompt,
              writable: true,
              configurable: true,
            });
          } catch (e) {
            console.warn("Nie udało się nadpisać Blockly.prompt:", e);
          }
        }
      }
    } catch (e) {
      console.warn("Błąd nadpisywania Blockly.prompt:", e);
    }

    // Zawsze nadpisujemy window.prompt jako backup
    window.prompt = customPrompt;

    return () => {
      // Przywracamy oryginalne funkcje przy czyszczeniu
      try {
        if (
          originalBlocklyPromptRef.current &&
          Object.isExtensible(Blockly)
        ) {
          Blockly.dialog.setPrompt(originalBlocklyPromptRef.current);
        }
        if (originalWindowPromptRef.current) {
          window.prompt = originalWindowPromptRef.current;
        }
      } catch (e) {
        // Ignorujemy błędy przy czyszczeniu
      }
    };
  }, []); // Pusta tablica - wykonaj tylko raz

  useEffect(() => {
    const currentToken = localStorage.getItem("token");
    setToken(currentToken);
    Blockly.setLocale(pl);

    javascriptGenerator.forBlock["text_print"] = function (block, generator) {
      const msg =
        generator.valueToCode(block, "TEXT", generator.ORDER_NONE) || "''";
      return `print(${msg});\n`;
    };

    const toolbox = {
      kind: "categoryToolbox",
      contents: [
        {
          kind: "category",
          name: "Tekst",
          colour: "290",
          contents: [
            { kind: "block", type: "text" },
            { kind: "block", type: "text_print" },
            { kind: "block", type: "text_join" },
            { kind: "block", type: "text_length" },
            { kind: "block", type: "text_changeCase" },
          ],
        },
        {
          kind: "category",
          name: "Logiczne",
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
          name: "Pętle",
          categorystyle: "loop_category",
          contents: [
            {
              kind: "block",
              type: "controls_repeat_ext",
              inputs: {
                TIMES: {
                  block: { type: "math_number", fields: { NUM: 10 } },
                },
              },
            },
            { kind: "block", type: "controls_whileUntil" },
            { kind: "block", type: "controls_for" },
          ],
        },
        {
          kind: "category",
          name: "Matematyczne",
          categorystyle: "math_category",
          contents: [
            { kind: "block", type: "math_number", fields: { NUM: 123 } },
            { kind: "block", type: "math_arithmetic" },
            { kind: "block", type: "math_single" },
            { kind: "block", type: "math_modulo" },
            { kind: "block", type: "math_random_int" },
            { kind: "block", type: "math_round" },
          ],
        },
        {
          kind: "category",
          name: "Zmienne",
          categorystyle: "variable_category",
          custom: "VARIABLE",
        },
      ],
    };



    if (blocklyDiv.current && !workspaceRef.current) {
      const workspace = Blockly.inject(blocklyDiv.current, {
        toolbox: toolbox,
        trashcan: true,
        sounds: false,
      });
      workspaceRef.current = workspace;

      loadWorkspaceFromLocalStorage();

      const onChange = (e) => {
        // pomijamy zdarzenia UI które nie zmieniają stanu (opcjonalnie)
        // ale zostawiamy zapis "bezpiecznie", bo i tak mamy debounce
        if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
        saveTimerRef.current = setTimeout(() => {
          saveWorkspaceToLocalStorage();
        }, 300);
      };
      workspace.addChangeListener(onChange);

      // =======Skróty klawiszowe Undo/Redo =======
      const onKeyDown = (ev) => {
        const isMac = navigator.platform.toUpperCase().includes("MAC");
        const ctrlOrCmd = isMac ? ev.metaKey : ev.ctrlKey;

        if (!ctrlOrCmd) return;

        // Ctrl+Z / Cmd+Z => undo
        if (ev.key.toLowerCase() === "z" && !ev.shiftKey) {
          ev.preventDefault();
          undoWorkspace();
        }

        // Ctrl+Y => redo (Windows) OR Ctrl+Shift+Z / Cmd+Shift+Z => redo
        if (
          ev.key.toLowerCase() === "y" ||
          (ev.key.toLowerCase() === "z" && ev.shiftKey)
        ) {
          ev.preventDefault();
          redoWorkspace();
        }
      };
      window.addEventListener("keydown", onKeyDown);

      // sprzątanie listenerów tylko dla tej instancji
      workspaceRef.current.__vpw_onKeyDown = onKeyDown;
      workspaceRef.current.__vpw_onChange = onChange;
    }

    return () => {
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current);
        saveTimerRef.current = null;
      }

      if (workspaceRef.current) {
        // usuń nasze listenery, zanim dispose
        try {
          const ws = workspaceRef.current;
          if (ws.__vpw_onChange) ws.removeChangeListener(ws.__vpw_onChange);
          if (ws.__vpw_onKeyDown) window.removeEventListener("keydown", ws.__vpw_onKeyDown);
        } catch {
          // ignore
        }

        workspaceRef.current.dispose();
        workspaceRef.current = null;
      }
    };
  }, [id]);

  const handleVariableConfirm = (variableName) => {
    const trimmed = variableName.trim();
    if (!trimmed || !workspaceRef.current) return;

    const isRename = variableModalTypeRef.current === "rename";
    const oldName = String(variableModalDefaultValueRef.current || "").trim();

    try {
      if (isRename && oldName) {
        // Zmiana nazwy zmiennej
        const variableMap = workspaceRef.current.getVariableMap();
        // Spróbuj znaleźć zmienną po nazwie (to jest najczęstszy przypadek)
        let variable = variableMap.getVariable(
          oldName,
          Blockly.VARIABLE_CATEGORY_NAME
        );

        // Jeśli nie znaleziono po nazwie, może to być ID zmiennej
        if (!variable) {
          // Spróbuj znaleźć po ID
          const allVariables = variableMap.getAllVariables();
          for (let i = 0; i < allVariables.length; i++) {
            if (
              allVariables[i].getId() === oldName ||
              allVariables[i].name === oldName
            ) {
              variable = allVariables[i];
              break;
            }
          }
        }

        if (variable) {
          // Używamy renameVariableById do zmiany nazwy
          workspaceRef.current.renameVariableById(variable.getId(), trimmed);

          // Wywołujemy callback z nową nazwą
          if (
            variableModalCallbackRef.current &&
            typeof variableModalCallbackRef.current === "function"
          ) {
            variableModalCallbackRef.current(trimmed);
          }
        } else {
          // Jeśli nie znaleziono zmiennej, tworzymy nową (fallback)
          workspaceRef.current.createVariable(trimmed);

          // Wywołujemy callback z nową nazwą
          if (
            variableModalCallbackRef.current &&
            typeof variableModalCallbackRef.current === "function"
          ) {
            variableModalCallbackRef.current(trimmed);
          }
        }
      } else {
        // Tworzenie nowej zmiennej
        workspaceRef.current.createVariable(trimmed);

        // Wywołujemy callback z nową nazwą
        if (
          variableModalCallbackRef.current &&
          typeof variableModalCallbackRef.current === "function"
        ) {
          variableModalCallbackRef.current(trimmed);
        }
      }
    } catch (e) {
      // Jeśli wystąpił błąd (np. zmienna już istnieje), wywołujemy callback z null
      if (
        variableModalCallbackRef.current &&
        typeof variableModalCallbackRef.current === "function"
      ) {
        variableModalCallbackRef.current(null);
      }
    }

    variableModalCallbackRef.current = null;
    variableModalTypeRef.current = "create";
  };

  const handleVariableKomClose = () => {
    setIsVariableKomOpen(false);
    variableModalCallbackRef.current = null;
    variableModalTypeRef.current = "create";
  };


  const runCode = async () => {
    const workspace = workspaceRef.current;
    if (!workspace) return alert("Brak workspace!");

    setOutput("");

    try {
      const getAllDescendants = (block, acc = new Set()) => {
        if (!block || acc.has(block.id)) return acc;
        acc.add(block.id);
        const children = block.getChildren(true);
        for (const child of children) {
          getAllDescendants(child, acc);
        }
        return acc;
      };

      const topBlocks = workspace.getTopBlocks(true);
      if (topBlocks.length === 0) {
        setOutput("(Brak bloków do uruchomienia)");
        return;
      }
      let mainStackTopBlock = null;
      let maxBlocksCount = 0;
      let mainStackBlockIds = new Set();
      for (const topBlock of topBlocks) {
        const currentStackIds = getAllDescendants(topBlock, new Set());
        if (currentStackIds.size > maxBlocksCount) {
          maxBlocksCount = currentStackIds.size;
          mainStackTopBlock = topBlock;
          mainStackBlockIds = currentStackIds;
        }
      }
      if (!mainStackTopBlock) {
        setOutput("(Nie znaleziono głównego stosu)");
        return;
      }

      javascriptGenerator.init(workspace);

      // Zabezpieczenie przed nieskończoną pętlą
      javascriptGenerator.INFINITE_LOOP_TRAP = 'if(--loopCounter < 0) throw new Error("Wykryto nieskończoną pętlę! Sprawdź warunki pętli.");\n';

      // NAJPIERW WYKONUJEMY KOD I WYŚWIETLAMY WYNIK
      let code = javascriptGenerator.blockToCode(mainStackTopBlock);

      javascriptGenerator.INFINITE_LOOP_TRAP = null; // Clean up

      // Dodaj inicjalizację licznika pętli
      code = "let loopCounter = 10000;\n" + code;

      let outputBuffer = [];
      const print = (msg) => {
        outputBuffer.push(String(msg ?? ""));
      };

      // Helper function for math_random_int block
      const mathRandomInt = (from, to) => {
        from = Math.floor(Number(from) || 0);
        to = Math.floor(Number(to) || 0);
        if (from > to) {
          const temp = from;
          from = to;
          to = temp;
        }
        return Math.floor(Math.random() * (to - from + 1)) + from;
      };

      let result = "";
      try {
        const AsyncFunction = Object.getPrototypeOf(
          async function () { }
        ).constructor;
        const wrappedCode = new AsyncFunction("print", "mathRandomInt", code);
        await wrappedCode(print, mathRandomInt);
        result = outputBuffer.join("\n").trim();
      } catch (execError) {
        console.error("Błąd wykonania:", execError);
        setOutput(`❌ Błąd wykonania: ${execError.message}`);
        return;
      }

      // Wyświetlamy wynik od razu
      setOutput(result || "(Brak wydruku na konsolę)");

      // TERAZ SPRAWDZAMY WALIDACJE - TYLKO NA PODSTAWIE XML
      const validation = validateTaskByXml(workspace, zadanie, result, code);

      if (!validation.passed) {
        setOutput(`Wynik:\n${result}\n\n❌ ${validation.message}`);
        return;
      }

      //w tym miejscu zadanie jest poprawne → zapisujemy progres
      await markTaskCompleted();
      setOutput(`Wynik:\n${result}\n\n✅ Zadanie wykonane poprawnie!`);
    } catch (e) {
      console.error("Błąd wykonania kodu Blockly:", e);
      setOutput("Błąd: " + e.message);
    }

  };

  // Navigacja poprzednie / następne
  const allTaskIds = Object.keys(zadania);
  const currentIndex = allTaskIds.indexOf(id);
  const prevTaskId = currentIndex > 0 ? allTaskIds[currentIndex - 1] : null;
  const nextTaskId = currentIndex >= 0 && currentIndex < allTaskIds.length - 1 ? allTaskIds[currentIndex + 1] : null;

  return (
    <div className="blockly-demo-container">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <Link to="/blockly" className="blockly-demo-back-link">
          ← Powrót do listy zadań
        </Link>
        <div style={{ display: "flex", gap: 10 }}>
          {prevTaskId && (
            <Link
              to={`/blockly/${prevTaskId}`}
              className="blockly-demo-back-link"
              style={{ marginBottom: 0 }}
            >
              ← Poprzednie
            </Link>
          )}
          {nextTaskId && (
            <Link
              to={`/blockly/${nextTaskId}`}
              className="blockly-demo-back-link"
              style={{ marginBottom: 0 }}
            >
              Następne →
            </Link>
          )}
        </div>
      </div>

      <div className="blockly-demo-header">
        <h2>{zadanie.tytul}</h2>
      </div>

      <div className="blockly-demo-instruction">
        <strong>Polecenie:</strong>
        <p>{zadanie.opis}</p>
      </div>

      {/* [NOWE] Przyciski UI: Undo / Redo / Reset */}
      <div className="blockly-demo-controls" style={{ gap: 8 }}>
        <button onClick={runCode}>Uruchom kod</button>

        <button onClick={undoWorkspace} title="Cofnij (Ctrl+Z)">
          Cofnij
        </button>
        <button onClick={redoWorkspace} title="Ponów (Ctrl+Y / Ctrl+Shift+Z)">
          Ponów
        </button>
        <button onClick={resetWorkspace} title="Czyści układ bloków dla tego zadania">
          Resetuj zadanie
        </button>
      </div>

      <div className="blockly-demo-workspace">
        <div className="blockly-demo-editor">
          <div ref={blocklyDiv} className="blockly-demo-blockly-div" />
        </div>

        <div className="blockly-demo-output">
          <div className="blockly-demo-output-panel">
            <div className="blockly-demo-output-title">Wynik</div>
            <div className="blockly-demo-terminal">{output}</div>
          </div>
        </div>
      </div>

      <VariableKom
        isOpen={isVariableKomOpen}
        onClose={handleVariableKomClose}
        onConfirm={handleVariableConfirm}
        title={
          variableModalTypeRef.current === "rename"
            ? "Zmień nazwę zmiennej"
            : "Utwórz zmienną"
        }
        placeholder="Nazwa zmiennej"
        defaultValue={variableModalDefaultValueRef.current}
        isRename={variableModalTypeRef.current === "rename"}
      />
    </div>
  );
}
