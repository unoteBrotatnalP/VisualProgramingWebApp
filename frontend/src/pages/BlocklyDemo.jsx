import React, { useEffect, useRef, useState } from "react";
import * as Blockly from "blockly";
import "blockly/blocks";
import { javascriptGenerator } from "blockly/javascript";
import { useNavigate, useParams, Link } from "react-router-dom";
import { setAuthToken } from "../lib/api";
import { zadania } from "../data/tasks";
import { validateTask } from "../lib/blocklyValidation";
import "./BlocklyDemo.css";
import * as pl from "blockly/msg/pl";
import api from "../lib/api";
import VariableKom from "../components/VariableKom";

const STAGE_W = 600;
const STAGE_H = 400;

function createStageRuntime(stageEl) {
  const sprites = new Map();
  let idSeq = 1;

  let textGroup = {
    el: null,
    x: 0,
    y: 0,
    size: 18,
    buffer: "",
    id: null,
  };

  function toCSS(x, y, w, h) {
    const left = STAGE_W / 2 + x - w / 2;
    const top = STAGE_H / 2 - y - h / 2;
    return { left, top };
  }

  function ensureSpriteStyles(el, w, h, rot) {
    el.style.position = "absolute";
    el.style.width = `${w}px`;
    el.style.height = `${h}px`;
    el.style.transformOrigin = "center center";
    el.style.userSelect = "none";
    el.style.touchAction = "none";
    el.style.cursor = "grab";
    el.style.transform = `rotate(${rot}deg)`;
  }

  function ensureTextStyles(el, rot) {
    el.style.position = "absolute";
    el.style.transformOrigin = "center center";
    el.style.userSelect = "none";
    el.style.touchAction = "none";
    el.style.cursor = "grab";
    el.style.transform = `rotate(${rot}deg)`;
    el.style.whiteSpace = "pre-wrap";
    el.style.display = "inline-block";
  }

  function makeDraggable(el, id) {
    let dragging = false;
    let startX = 0,
      startY = 0;
    let startSprite = { x: 0, y: 0 };
    const onMouseDown = (e) => {
      dragging = true;
      startX = e.clientX;
      startY = e.clientY;
      const s = sprites.get(id);
      startSprite = { x: s.x, y: s.y };
      el.style.cursor = "grabbing";
      e.preventDefault();
    };
    const onMouseMove = (e) => {
      if (!dragging) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      const s = sprites.get(id);
      setPosition(id, startSprite.x + dx, startSprite.y - dy);
    };
    const onMouseUp = () => {
      dragging = false;
      el.style.cursor = "grab";
    };
    el.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  }

  function measure(el) {
    const w = Math.ceil(el.scrollWidth);
    const h = Math.ceil(el.scrollHeight);
    return { w: Math.max(1, w), h: Math.max(1, h) };
  }

  function addSprite(url, x = 0, y = 0, w = 100, h = 100, draggable = true) {
    const id = `sprite_${idSeq++}`;
    const img = new Image();
    img.src = String(url || "");
    img.alt = "sprite";
    img.referrerPolicy = "no-referrer";
    img.setAttribute("data-scene-item", "1");

    ensureSpriteStyles(img, w, h, 0);

    const { left, top } = toCSS(x, y, w, h);
    img.style.left = `${left}px`;
    img.style.top = `${top}px`;

    stageEl.appendChild(img);
    sprites.set(id, { el: img, x, y, w, h, rot: 0, kind: "sprite" });
    if (draggable) makeDraggable(img, id);
    return id;
  }

  function addText(text, x = 0, y = 0, size = 18) {
    const id = `text_${idSeq++}`;
    const el = document.createElement("div");
    el.setAttribute("data-scene-item", "1");
    el.textContent = String(text ?? "");
    el.style.font = `600 ${size}px system-ui, sans-serif`;
    el.style.color = "#111";
    el.style.background = "rgba(255,255,255,.85)";
    el.style.border = "1px solid #ddd";
    el.style.borderRadius = "8px";
    el.style.padding = "6px 10px";

    ensureTextStyles(el, 0);
    stageEl.appendChild(el);

    const { w, h } = measure(el);
    const { left, top } = toCSS(x, y, w, h);
    el.style.left = `${left}px`;
    el.style.top = `${top}px`;

    sprites.set(id, { el, x, y, w, h, rot: 0, kind: "text" });
    makeDraggable(el, id);

    return { id, el };
  }

  function setPosition(id, x, y) {
    const s = sprites.get(id);
    if (!s) return;
    s.x = Number(x) || 0;
    s.y = Number(y) || 0;

    if (s.kind === "text") {
      const m = measure(s.el);
      s.w = m.w;
      s.h = m.h;
    }

    const { left, top } = toCSS(s.x, s.y, s.w, s.h);
    s.el.style.left = `${left}px`;
    s.el.style.top = `${top}px`;
  }

  function moveBy(id, dx, dy) {
    const s = sprites.get(id);
    if (!s) return;
    setPosition(id, s.x + (Number(dx) || 0), s.y + (Number(dy) || 0));
  }

  function rotateBy(id, deg) {
    const s = sprites.get(id);
    if (!s) return;
    s.rot = (s.rot || 0) + (Number(deg) || 0);
    s.el.style.transform = `rotate(${s.rot}deg)`;
  }

  function setSize(id, w, h) {
    const s = sprites.get(id);
    if (!s) return;
    s.w = Math.max(1, Number(w) || s.w);
    s.h = Math.max(1, Number(h) || s.h);
    if (s.kind === "sprite") {
      s.el.style.width = `${s.w}px`;
      s.el.style.height = `${s.h}px`;
      const { left, top } = toCSS(s.x, s.y, s.w, s.h);
      s.el.style.left = `${left}px`;
      s.el.style.top = `${top}px`;
    } else {
      const m = measure(s.el);
      s.w = m.w;
      s.h = m.h;
      const { left, top } = toCSS(s.x, s.y, s.w, s.h);
      s.el.style.left = `${left}px`;
      s.el.style.top = `${top}px`;
    }
  }

  function clear() {
    sprites.forEach((s) => s.el.remove());
    sprites.clear();

    stageEl.querySelectorAll('[data-scene-item="1"]').forEach((n) => n.remove());

    textGroup.el = null;
    textGroup.buffer = "";
    textGroup.id = null;
  }

  function wait(ms = 0) {
    return new Promise((resolve) =>
      setTimeout(resolve, Math.max(0, Number(ms) || 0))
    );
  }

  function startTextGroup(x = 0, y = 0, size = 18, reset = true) {
    if (reset) {
      textGroup.buffer = "";
      textGroup.el = null;
      textGroup.id = null;
    }
    textGroup.x = Number(x) || 0;
    textGroup.y = Number(y) || 0;
    textGroup.size = Number(size) || 18;

    if (!textGroup.el) {
      const { id, el } = addText("", textGroup.x, textGroup.y, textGroup.size);
      textGroup.el = el;
      textGroup.id = id;
      el.style.cursor = "grab";

      el.style.minWidth = "1px";
      el.style.minHeight = "1px";
    }
  }

  function appendTextToGroup(text) {
    const t = String(text ?? "");
    if (textGroup.el && textGroup.id) {
      textGroup.buffer += (textGroup.buffer ? "\n" : "") + t;
      textGroup.el.textContent = textGroup.buffer;

      const s = sprites.get(textGroup.id);
      if (s) {
        const m = measure(textGroup.el);
        s.w = m.w;
        s.h = m.h;
        const { left, top } = toCSS(s.x, s.y, s.w, s.h);
        textGroup.el.style.left = `${left}px`;
        textGroup.el.style.top = `${top}px`;
      }
    } else {
      addText(t, 0, -150, 18);
    }
  }

  function endTextGroup() {}

  return {
    addSprite,
    addText,
    setPosition,
    moveBy,
    rotateBy,
    setSize,
    clear,
    wait,
    startTextGroup,
    appendTextToGroup,
    endTextGroup,
  };
}

/* ============================================================
   BLOKI I GENERATORY
============================================================ */

// Domyślnie tryb "scena", w useEffect nadpisujemy dla trybu prostego
javascriptGenerator.forBlock["text_print"] = function (block, generator) {
  const msg = generator.valueToCode(block, "TEXT", generator.ORDER_NONE) || "''";
  return `
    if (BlocklyRuntime && BlocklyRuntime.appendTextToGroup) {
      BlocklyRuntime.appendTextToGroup(${msg});
    } else {
      BlocklyRuntime.addText(${msg}, 0, -150, 18);
    }
  `;
};

Blockly.Blocks["stage_create_sprite_as"] = {
  init: function () {
    this.appendDummyInput()
      .appendField("utwórz sprite i zapisz jako")
      .appendField(new Blockly.FieldVariable("sprite1"), "VAR");
    this.appendValueInput("URL").setCheck("String").appendField("URL");
    this.appendValueInput("X").setCheck("Number").appendField("x");
    this.appendValueInput("Y").setCheck("Number").appendField("y");
    this.appendValueInput("W").setCheck("Number").appendField("szer.");
    this.appendValueInput("H").setCheck("Number").appendField("wys.");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(20);
    this.setTooltip("Tworzy sprite i przypisuje jego ID do wybranej zmiennej");
  },
};
javascriptGenerator.forBlock["stage_create_sprite_as"] = function (block) {
  const varName = javascriptGenerator.nameDB_.getName(
    block.getFieldValue("VAR"),
    Blockly.VARIABLE_CATEGORY_NAME
  );
  const url =
    javascriptGenerator.valueToCode(block, "URL", javascriptGenerator.ORDER_NONE) ||
    "''";
  const x =
    javascriptGenerator.valueToCode(block, "X", javascriptGenerator.ORDER_NONE) ||
    "0";
  const y =
    javascriptGenerator.valueToCode(block, "Y", javascriptGenerator.ORDER_NONE) ||
    "0";
  const w =
    javascriptGenerator.valueToCode(block, "W", javascriptGenerator.ORDER_NONE) ||
    "100";
  const h =
    javascriptGenerator.valueToCode(block, "H", javascriptGenerator.ORDER_NONE) ||
    "100";
  return `${varName} = BlocklyRuntime.addSprite(${url}, ${x}, ${y}, ${w}, ${h});\n`;
};

Blockly.Blocks["stage_set_pos"] = {
  init: function () {
    this.appendValueInput("ID").setCheck("String").appendField("ustaw pozycję sprite");
    this.appendValueInput("X").setCheck("Number").appendField("x");
    this.appendValueInput("Y").setCheck("Number").appendField("y");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(200);
  },
};
javascriptGenerator.forBlock["stage_set_pos"] = function (block) {
  const id =
    javascriptGenerator.valueToCode(block, "ID", javascriptGenerator.ORDER_NONE) ||
    "''";
  const x =
    javascriptGenerator.valueToCode(block, "X", javascriptGenerator.ORDER_NONE) ||
    "0";
  const y =
    javascriptGenerator.valueToCode(block, "Y", javascriptGenerator.ORDER_NONE) ||
    "0";
  return `BlocklyRuntime.setPosition(${id}, ${x}, ${y});\n`;
};

Blockly.Blocks["stage_move_by"] = {
  init: function () {
    this.appendValueInput("ID").setCheck("String").appendField("przesuń sprite");
    this.appendValueInput("DX").setCheck("Number").appendField("o dx");
    this.appendValueInput("DY").setCheck("Number").appendField("i dy");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(200);
  },
};
javascriptGenerator.forBlock["stage_move_by"] = function (block) {
  const id =
    javascriptGenerator.valueToCode(block, "ID", javascriptGenerator.ORDER_NONE) ||
    "''";
  const dx =
    javascriptGenerator.valueToCode(block, "DX", javascriptGenerator.ORDER_NONE) ||
    "0";
  const dy =
    javascriptGenerator.valueToCode(block, "DY", javascriptGenerator.ORDER_NONE) ||
    "0";
  return `BlocklyRuntime.moveBy(${id}, ${dx}, ${dy});\n`;
};

Blockly.Blocks["stage_rotate_by"] = {
  init: function () {
    this.appendValueInput("ID").setCheck("String").appendField("obróć sprite");
    this.appendValueInput("DEG").setCheck("Number").appendField("o stopnie");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(200);
  },
};
javascriptGenerator.forBlock["stage_rotate_by"] = function (block) {
  const id =
    javascriptGenerator.valueToCode(block, "ID", javascriptGenerator.ORDER_NONE) ||
    "''";
  const deg =
    javascriptGenerator.valueToCode(block, "DEG", javascriptGenerator.ORDER_NONE) ||
    "0";
  return `BlocklyRuntime.rotateBy(${id}, ${deg});\n`;
};

Blockly.Blocks["stage_set_size"] = {
  init: function () {
    this.appendValueInput("ID").setCheck("String").appendField("ustaw rozmiar sprite");
    this.appendValueInput("W").setCheck("Number").appendField("szer.");
    this.appendValueInput("H").setCheck("Number").appendField("wys.");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(200);
  },
};
javascriptGenerator.forBlock["stage_set_size"] = function (block) {
  const id =
    javascriptGenerator.valueToCode(block, "ID", javascriptGenerator.ORDER_NONE) ||
    "''";
  const w =
    javascriptGenerator.valueToCode(block, "W", javascriptGenerator.ORDER_NONE) ||
    "100";
  const h =
    javascriptGenerator.valueToCode(block, "H", javascriptGenerator.ORDER_NONE) ||
    "100";
  return `BlocklyRuntime.setSize(${id}, ${w}, ${h});\n`;
};

Blockly.Blocks["stage_say"] = {
  init: function () {
    this.appendValueInput("TEXT").setCheck("String").appendField("powiedz");
    this.appendValueInput("X").setCheck("Number").appendField("na x");
    this.appendValueInput("Y").setCheck("Number").appendField("i y");
    this.setOutput(true, "String");
    this.setColour(260);
  },
};
javascriptGenerator.forBlock["stage_say"] = function (block) {
  const t =
    javascriptGenerator.valueToCode(block, "TEXT", javascriptGenerator.ORDER_NONE) ||
    "''";
  const x =
    javascriptGenerator.valueToCode(block, "X", javascriptGenerator.ORDER_NONE) ||
    "0";
  const y =
    javascriptGenerator.valueToCode(block, "Y", javascriptGenerator.ORDER_NONE) ||
    "0";
  return [`BlocklyRuntime.addText(${t}, ${x}, ${y}, 18)`, javascriptGenerator.ORDER_FUNCTION_CALL];
};

Blockly.Blocks["stage_clear"] = {
  init: function () {
    this.appendDummyInput().appendField("wyczyść scenę");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(0);
  },
};
javascriptGenerator.forBlock["stage_clear"] = function () {
  return `BlocklyRuntime.clear();\n`;
};

Blockly.Blocks["stage_wait"] = {
  init: function () {
    this.appendValueInput("MS").setCheck("Number").appendField("czekaj (ms)");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(330);
  },
};
javascriptGenerator.forBlock["stage_wait"] = function (block) {
  const ms =
    javascriptGenerator.valueToCode(block, "MS", javascriptGenerator.ORDER_NONE) ||
    "0";
  return `await BlocklyRuntime.wait(${ms});\n`;
};

Blockly.Blocks["text_group_start"] = {
  init: function () {
    this.appendValueInput("X")
      .setCheck("Number")
      .appendField("rozpocznij blok tekstu na x");
    this.appendValueInput("Y").setCheck("Number").appendField("i y");
    this.appendValueInput("SIZE").setCheck("Number").appendField("rozmiar");
    this.appendDummyInput()
      .appendField("wyczyść poprzedni")
      .appendField(new Blockly.FieldCheckbox("TRUE"), "RESET");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(290);
  },
};
javascriptGenerator.forBlock["text_group_start"] = function (block) {
  const x =
    javascriptGenerator.valueToCode(block, "X", javascriptGenerator.ORDER_NONE) ||
    "0";
  const y =
    javascriptGenerator.valueToCode(block, "Y", javascriptGenerator.ORDER_NONE) ||
    "0";
  const size =
    javascriptGenerator.valueToCode(block, "SIZE", javascriptGenerator.ORDER_NONE) ||
    "18";
  const reset = block.getFieldValue("RESET") === "TRUE" ? "true" : "false";
  return `BlocklyRuntime.startTextGroup(${x}, ${y}, ${size}, ${reset});\n`;
};

Blockly.Blocks["text_group_end"] = {
  init: function () {
    this.appendDummyInput().appendField("zakończ blok tekstu");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(290);
  },
};
javascriptGenerator.forBlock["text_group_end"] = function () {
  return `BlocklyRuntime.endTextGroup();\n`;
};

/* ============================================================
   KOMPONENT
============================================================ */
export default function BlocklyDemo() {
  const { id } = useParams();
  const zadanie = zadania[id] || { tytul: "Nieznane zadanie", opis: "" };

  const isSimpleMode = zadanie.kategoria !== "graficzne";

  const blocklyDiv = useRef(null);
  const workspaceRef = useRef(null);
  const stageRef = useRef(null);
  const runtimeRef = useRef(null);

  const [output, setOutput] = useState("(Konsola pusta)");
  const [outputInfo, setOutputInfo] = useState("");
  const navigate = useNavigate();
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [isVariableKomOpen, setIsVariableKomOpen] = useState(false);
  const variableModalCallbackRef = useRef(null);
  const variableModalDefaultValueRef = useRef("");
  const variableModalTypeRef = useRef("create"); // "create" lub "rename"
  const originalBlocklyPromptRef = useRef(null);
  const originalWindowPromptRef = useRef(null);

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
      const hasDefaultValue = defaultValue && String(defaultValue).trim().length > 0;
      
      // Wykrywanie zmiany nazwy - komunikat zawiera "zmień nazwy" lub "zmień nazwę"
      const isVariableRename = 
        messageStr.includes("zmień nazwy") ||
        messageStr.includes("zmien nazwy") ||
        messageStr.includes("zmień nazwę") ||
        messageStr.includes("zmien nazwe") ||
        messageStr.includes("rename") ||
        messageStr.includes("nowa nazwa zmiennej") ||
        (hasDefaultValue && (messageStr.includes("zmiennych") || messageStr.includes("zmiennej") || messageStr.includes("variable")));
      
      // Wykrywanie tworzenia nowej zmiennej
      const isVariableCreation = 
        !isVariableRename && (
          messageStr.includes("zmienną") ||
          messageStr.includes("zmiennej") ||
          messageStr.includes("variable") ||
          messageStr.includes("new_variable") ||
          messageStr.includes("nowa nazwa")
        );
      
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
        if (originalBlocklyPromptRef.current && typeof originalBlocklyPromptRef.current === 'function') {
          return originalBlocklyPromptRef.current(message, defaultValue, callback);
        } else if (originalWindowPromptRef.current) {
          try {
            const result = originalWindowPromptRef.current.call(window, message, defaultValue);
            if (callback && typeof callback === 'function') {
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
          Blockly.prompt = customPrompt;
        } else {
          try {
            Object.defineProperty(Blockly, 'prompt', {
              value: customPrompt,
              writable: true,
              configurable: true
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
        if (originalBlocklyPromptRef.current && Object.isExtensible(Blockly)) {
          Blockly.prompt = originalBlocklyPromptRef.current;
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

    if (isSimpleMode) {
      javascriptGenerator.forBlock["text_print"] = function (block, generator) {
        const msg =
          generator.valueToCode(block, "TEXT", generator.ORDER_NONE) || "''";
        return `print(${msg});\n`;
      };
    } else {
      javascriptGenerator.forBlock["text_print"] = function (block, generator) {
        const msg =
          generator.valueToCode(block, "TEXT", generator.ORDER_NONE) || "''";
        return `
          if (BlocklyRuntime && BlocklyRuntime.appendTextToGroup) {
            BlocklyRuntime.appendTextToGroup(${msg});
          } else {
            BlocklyRuntime.addText(${msg}, 0, -150, 18);
          }
        `;
      };
    }

    if (!isSimpleMode && stageRef.current) {
      runtimeRef.current = createStageRuntime(stageRef.current);
    }

    const toolbox = isSimpleMode
      ? {
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
              ],
            },
            {
              kind: "category",
              name: "Zmienne",
              categorystyle: "variable_category",
              custom: "VARIABLE",
            },
          ],
        }
      : {
          kind: "categoryToolbox",
          contents: [
            {
              kind: "category",
              name: "Scena",
              colour: "310",
              contents: [
                { kind: "block", type: "stage_clear" },
                {
                  kind: "block",
                  type: "stage_wait",
                  inputs: {
                    MS: { block: { type: "math_number", fields: { NUM: 300 } } },
                  },
                },
              ],
            },
            {
              kind: "category",
              name: "Tekst",
              colour: "290",
              contents: [
                {
                  kind: "block",
                  type: "text_group_start",
                  inputs: {
                    X: { block: { type: "math_number", fields: { NUM: 0 } } },
                    Y: { block: { type: "math_number", fields: { NUM: 120 } } },
                    SIZE: {
                      block: { type: "math_number", fields: { NUM: 18 } },
                    },
                  },
                  fields: { RESET: "TRUE" },
                },
                { kind: "block", type: "text_group_end" },
                { kind: "block", type: "text" },
                { kind: "block", type: "text_print" },
              ],
            },
            {
              kind: "category",
              name: "Obrazy",
              colour: "20",
              contents: [
                {
                  kind: "block",
                  type: "stage_create_sprite_as",
                  fields: { VAR: "sprite1" },
                  inputs: {
                    URL: {
                      block: {
                        type: "text",
                        fields: { TEXT: "https://picsum.photos/200" },
                      },
                    },
                    X: { block: { type: "math_number", fields: { NUM: 0 } } },
                    Y: { block: { type: "math_number", fields: { NUM: 0 } } },
                    W: { block: { type: "math_number", fields: { NUM: 120 } } },
                    H: { block: { type: "math_number", fields: { NUM: 120 } } },
                  },
                },
                {
                  kind: "block",
                  type: "stage_set_pos",
                  inputs: {
                    ID: {
                      block: { type: "variables_get", fields: { VAR: "sprite1" } },
                    },
                    X: { block: { type: "math_number", fields: { NUM: 0 } } },
                    Y: { block: { type: "math_number", fields: { NUM: 0 } } },
                  },
                },
                {
                  kind: "block",
                  type: "stage_move_by",
                  inputs: {
                    ID: {
                      block: { type: "variables_get", fields: { VAR: "sprite1" } },
                    },
                    DX: { block: { type: "math_number", fields: { NUM: 20 } } },
                    DY: { block: { type: "math_number", fields: { NUM: 0 } } },
                  },
                },
                {
                  kind: "block",
                  type: "stage_rotate_by",
                  inputs: {
                    ID: {
                      block: { type: "variables_get", fields: { VAR: "sprite1" } },
                    },
                    DEG: { block: { type: "math_number", fields: { NUM: 15 } } },
                  },
                },
                {
                  kind: "block",
                  type: "stage_set_size",
                  inputs: {
                    ID: {
                      block: { type: "variables_get", fields: { VAR: "sprite1" } },
                    },
                    W: { block: { type: "math_number", fields: { NUM: 120 } } },
                    H: { block: { type: "math_number", fields: { NUM: 120 } } },
                  },
                },
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
      });
      workspaceRef.current = workspace;
    }

    return () => {
      if (workspaceRef.current) {
        workspaceRef.current.dispose();
        workspaceRef.current = null;
      }
    };
  }, [isSimpleMode]);

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
        let variable = variableMap.getVariable(oldName, Blockly.VARIABLE_CATEGORY_NAME);
        
        // Jeśli nie znaleziono po nazwie, może to być ID zmiennej
        if (!variable) {
          // Spróbuj znaleźć po ID
          const allVariables = variableMap.getAllVariables();
          for (let i = 0; i < allVariables.length; i++) {
            if (allVariables[i].getId() === oldName || allVariables[i].name === oldName) {
              variable = allVariables[i];
              break;
            }
          }
        }
        
        if (variable) {
          // Używamy renameVariableById do zmiany nazwy
          workspaceRef.current.renameVariableById(variable.getId(), trimmed);
          
          // Wywołujemy callback z nową nazwą
          if (variableModalCallbackRef.current && typeof variableModalCallbackRef.current === 'function') {
            variableModalCallbackRef.current(trimmed);
          }
        } else {
          // Jeśli nie znaleziono zmiennej, tworzymy nową (fallback)
          workspaceRef.current.createVariable(trimmed);
          
          // Wywołujemy callback z nową nazwą
          if (variableModalCallbackRef.current && typeof variableModalCallbackRef.current === 'function') {
            variableModalCallbackRef.current(trimmed);
          }
        }
      } else {
        // Tworzenie nowej zmiennej
        workspaceRef.current.createVariable(trimmed);
        
        // Wywołujemy callback z nową nazwą
        if (variableModalCallbackRef.current && typeof variableModalCallbackRef.current === 'function') {
          variableModalCallbackRef.current(trimmed);
        }
      }
    } catch (e) {
      // Jeśli wystąpił błąd (np. zmienna już istnieje), wywołujemy callback z null
      if (variableModalCallbackRef.current && typeof variableModalCallbackRef.current === 'function') {
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

  const showCode = () => {
    const workspace = workspaceRef.current;
    if (!workspace) return alert("Brak workspace!");
    javascriptGenerator.init(workspace);
    const code = javascriptGenerator.workspaceToCode(workspace);
    alert(code);
  };

  const runCode = async () => {
    const workspace = workspaceRef.current;
    if (!workspace) return alert("Brak workspace!");

    if (isSimpleMode) {
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

        // NAJPIERW WYKONUJEMY KOD I WYŚWIETLAMY WYNIK
        const code = javascriptGenerator.blockToCode(mainStackTopBlock);

        let outputBuffer = [];
        const print = (msg) => {
          outputBuffer.push(String(msg ?? ""));
        };

        let result = "";
        try {
          const AsyncFunction = Object.getPrototypeOf(
            async function () {}
          ).constructor;
          const wrappedCode = new AsyncFunction("print", code);
          await wrappedCode(print);
          result = outputBuffer.join("\n").trim();
        } catch (execError) {
          console.error("Błąd wykonania:", execError);
          setOutput(`❌ Błąd wykonania: ${execError.message}`);
          return;
        }

        // Wyświetlamy wynik od razu
        setOutput(result || "(Brak wydruku na konsolę)");

        // TERAZ SPRAWDZAMY WALIDACJE
        const validation = validateTask(workspace, zadanie, result, code);
        if (!validation.passed) {
          setOutput(`Wynik:\n${result}\n\n❌ ${validation.message}`);
          return;
        }

        // ✅ w tym miejscu zadanie jest poprawne → zapisujemy progres
        await markTaskCompleted();
        setOutput(`Wynik:${result}\n\n✅ Zadanie wykonane poprawnie!`);
      } catch (e) {
        console.error("Błąd wykonania kodu Blockly:", e);
        setOutput("Błąd: " + e.message);
      }
    } else {
      if (!runtimeRef.current) return alert("Brak runtime sceny!");

      try {
        javascriptGenerator.init(workspace);
        const code = javascriptGenerator.workspaceToCode(workspace);
        runtimeRef.current.clear();
        setOutputInfo("");

        const wrapped = new Function(
          "BlocklyRuntime",
          `"use strict"; return (async () => { ${code} })();`
        );
        await wrapped(runtimeRef.current);

        // ✅ scena uruchomiona bez błędu → zapis progresu
        await markTaskCompleted();
      } catch (e) {
        setOutputInfo("Błąd: " + (e?.message || String(e)));
      }
    }
  };

  return (
    <div className="blockly-demo-container">
      <Link to="/blockly" className="blockly-demo-back-link">
        ← Powrót do listy zadań
      </Link>

      <div className="blockly-demo-header">
        <h2>{zadanie.tytul}</h2>
      </div>

      <div className="blockly-demo-instruction">
        <strong>Polecenie:</strong>
        <p>{zadanie.opis}</p>
      </div>

      <div className="blockly-demo-controls">
        <button onClick={showCode}>Pokaż kod JS</button>
        <button onClick={runCode}>Uruchom kod</button>
      </div>

      <div className="blockly-demo-workspace">
        <div className="blockly-demo-editor">
          <div ref={blocklyDiv} className="blockly-demo-blockly-div" />
        </div>

        {isSimpleMode ? (
          <div className="blockly-demo-output">
            <div className="blockly-demo-output-panel">
              <div className="blockly-demo-output-title">Wynik</div>
              <div className="blockly-demo-terminal">{output}</div>
            </div>
          </div>
        ) : (
          <div className="blockly-demo-output">
            <div className="blockly-demo-scene-container">
              <div className="blockly-demo-scene-title">
                Scena (0,0 w środku; szer. {STAGE_W}, wys. {STAGE_H})
              </div>
              <div ref={stageRef} className="blockly-demo-stage">
                <div className="blockly-demo-stage-axis blockly-demo-stage-axis-h" />
                <div className="blockly-demo-stage-axis blockly-demo-stage-axis-v" />
              </div>
              {outputInfo && (
                <div className="blockly-demo-error">{outputInfo}</div>
              )}
            </div>
          </div>
        )}
      </div>

      <VariableKom
        isOpen={isVariableKomOpen}
        onClose={handleVariableKomClose}
        onConfirm={handleVariableConfirm}
        title={variableModalTypeRef.current === "rename" ? "Zmień nazwę zmiennej" : "Utwórz zmienną"}
        placeholder="Nazwa zmiennej"
        defaultValue={variableModalDefaultValueRef.current}
        isRename={variableModalTypeRef.current === "rename"}
      />
    </div>
  );
}
