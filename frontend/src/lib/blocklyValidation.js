// Helper do pobierania wszystkich bloków
const getAllBlocks = (workspace) => {
  return workspace.getAllBlocks(false).filter((b) => {
    if (!b || typeof b !== "object") return false;
    // Ignorujemy nieaktywne/zwinięte jeśli to konieczne, ale zazwyczaj chcemy sprawdzać wszystkie
    if (typeof b.isDisabled === "function" && b.isDisabled()) return false;
    return b.type !== undefined;
  });
};

// Sprawdza czy wymagane bloki zostały użyte
// required może zawierać:
// - stringi: "text_print" - wymaga przynajmniej 1 wystąpienia
// - obiekty: { type: "text_print", count: 2 } - wymaga przynajmniej 2 wystąpień
const checkRequiredBlocks = (allBlocks, required = []) => {
  const blockNames = {
    variables_set: "ustaw zmienną",
    variables_get: "pobierz zmienną",
    text_print: "wydrukuj",
    text_join: "połącz",
    text: "tekst",
    controls_repeat_ext: "powtórz",
    controls_for: "pętla FOR",
    controls_whileUntil: "pętla WHILE",
    controls_if: "jeśli",
    logic_compare: "porównanie",
    logic_operation: "operacja logiczna",
    logic_negate: "negacja",
    logic_boolean: "wartość logiczna",
    math_arithmetic: "działanie matematyczne",
    math_modulo: "modulo",
    math_number: "liczba",
    math_single: "funkcja matematyczna",
    math_change: "zmień zmienną o",
  };

  // Policz wystąpienia każdego typu bloku
  const blockCounts = new Map();
  for (const block of allBlocks) {
    const count = blockCounts.get(block.type) || 0;
    blockCounts.set(block.type, count + 1);
  }

  const missing = [];
  
  for (const req of required) {
    let blockType, requiredCount;
    
    // Obsługa zarówno stringów jak i obiektów
    if (typeof req === "string") {
      blockType = req;
      requiredCount = 1;
    } else if (req && typeof req === "object" && req.type) {
      blockType = req.type;
      requiredCount = req.count || 1;
    } else {
      continue; // Pomijamy nieprawidłowe wpisy
    }
    
    const actualCount = blockCounts.get(blockType) || 0;
    
    if (actualCount < requiredCount) {
      const blockName = blockNames[blockType] || blockType;
      if (requiredCount === 1) {
        missing.push(blockName);
      } else {
        missing.push(`${blockName} (wymagane: ${requiredCount}, użyto: ${actualCount})`);
      }
    }
  }

  if (missing.length > 0) {
    return `Brakuje wymaganych bloków: ${missing.join(", ")}`;
  }
  return null;
};

// Sprawdza czy użyto niedozwolonych bloków
const checkForbiddenBlocks = (allBlocks, forbidden = []) => {
  const usedTypes = new Set(allBlocks.map((b) => b.type));
  for (const blockType of forbidden) {
    if (usedTypes.has(blockType)) {
      return `Użyto niedozwolonego bloku: ${blockType}`;
    }
  }
  return null;
};

// Generyczne sprawdzenie struktury (pętle, matematyka)
const checkStructure = (workspace, allBlocks, required) => {
  // 1. Sprawdzenie pętli - czy mają zawartość
  const loopTypes = ["controls_repeat_ext", "controls_for", "controls_whileUntil"];
  
  for (const loopType of loopTypes) {
    // Sprawdzamy tylko jeśli dana pętla jest wymagana lub użyta (opcjonalnie)
    // W starej wersji sprawdzaliśmy tylko jeśli wymagana. 
    // Dla bezpieczeństwa sprawdźmy wszystkie użyte pętle.
    const loops = allBlocks.filter(b => b.type === loopType);
    for (const loop of loops) {
      const doBlock = loop.getInputTargetBlock("DO");
      if (!doBlock) {
        return `Pętla (typ: ${loopType}) nie może być pusta - umieść bloki wewnątrz.`;
      }
    }
  }

  // 2. Jeśli wymagany jest print i pętla, sprawdź czy print jest w pętli
  // To jest specyficzne wymaganie z poprzedniego kodu, zachowujemy je jako "dobrą praktykę"
  // ale tylko jeśli oba są wymagane.
  const printRequired = required.includes("text_print");
  const anyLoopRequired = loopTypes.some(t => required.includes(t));

  if (printRequired && anyLoopRequired) {
     const printBlocks = allBlocks.filter(b => b.type === "text_print");
     // Jeśli mamy printy, przynajmniej jeden powinien być w pętli (lub wszystkie? stary kod wymagał każdego printa w pętli co jest ostre)
     // Stary kod: "Blok 'wypisz' musi być wewnątrz pętli" - sugeruje że wszystkie.
     // Złagodzimy to: jeśli mamy pętlę, to oczekujemy że print jest w niej użyty.
     
     // Sprawdźmy czy jakikolwiek print jest w pętli
     const isAnyPrintInLoop = printBlocks.some(printBlock => {
       let curr = printBlock.getParent();
       while (curr) {
         if (loopTypes.includes(curr.type)) return true;
         curr = curr.getParent();
       }
       return false;
     });

     if (printBlocks.length > 0 && !isAnyPrintInLoop) {
       // To może być zbyt restrykcyjne dla niektórych zadań, ale było w oryginale.
       return "Blok 'wypisz' powinien znaleźć się wewnątrz pętli.";
     }
  }

  // 3. Sprawdzenie bloków matematycznych (nie tekst)
  const mathTypes = ["math_arithmetic", "math_modulo", "math_single"];
  const mathBlocks = allBlocks.filter(b => mathTypes.includes(b.type));
  
  for (const block of mathBlocks) {
    // Sprawdzamy zagnieżdżone inputy rekurencyjnie pod kątem typu "text"
    const checkInputs = (b) => {
        if (!b) return false;
        if (b.type === "text") return true;
        const inputs = b.inputList || [];
        for (const input of inputs) {
            if (input.connection && input.connection.targetBlock()) {
                if (checkInputs(input.connection.targetBlock())) return true;
            }
        }
        return false;
    };
    
    // Sprawdź bezpośrednie podłączenia do tego bloku
    if (checkInputs(block)) {
        return "Bloki matematyczne muszą używać liczb, nie tekstów.";
    }
  }

  return null;
};

// Sprawdzenie wyniku (output)
const checkSolution = (result, solution) => {
  if (!solution) return null; // Brak definicji rozwiązania = brak sprawdzania

  const actual = (result || "").trim();
  
  if (solution instanceof RegExp) {
    if (!solution.test(actual)) {
      return "Wynik nie spełnia oczekiwanego wzorca.";
    }
  } else {
    const expected = String(solution).trim();
    if (actual !== expected) {
      return `Wynik niepoprawny.\nOczekiwano:\n${expected}\nOtrzymano:\n${actual}`;
    }
  }
  return null;
};

/**
 * Główna funkcja walidująca
 * @param {object} workspace - instancja Blockly workspace
 * @param {object} task - obiekt zadania z konfiguracją
 * @param {string} output - wynik wykonania kodu (tekst z konsoli)
 * @param {string} code - wygenerowany kod JS (opcjonalnie)
 * @returns {object} { passed: boolean, message: string | null }
 */
export const validateTask = (workspace, task, output, code = "") => {
  const allBlocks = getAllBlocks(workspace);
  const { required = [], forbidden = [], rozwiazanie, logicCheck } = task;

  // 1. Wymagane bloki
  const reqError = checkRequiredBlocks(allBlocks, required);
  if (reqError) return { passed: false, message: reqError };

  // 2. Niedozwolone bloki
  const forbError = checkForbiddenBlocks(allBlocks, forbidden);
  if (forbError) return { passed: false, message: forbError };

  // 3. Struktura ogólna (pętle, typy)
  const structError = checkStructure(workspace, allBlocks, required);
  if (structError) return { passed: false, message: structError };

  // 4. Custom logicCheck (z definicji zadania)
  // Pozwala na specyficzną logikę jeśli naprawdę potrzebna (np. sprawdzanie wartości 5 i 3)
  // Przekazujemy workspace żeby można było sprawdzać wartości bloków
  if (typeof logicCheck === "function") {
      // Przygotujmy prostą listę typów dla wygody
      const usedBlockTypes = allBlocks.map(b => b.type);
      // Wywołujemy z pełnym kontekstem
      const logicResult = logicCheck({ 
          code, 
          output, 
          workspace, 
          allBlocks,
          usedBlockTypes 
      });
      
      if (logicResult === false) {
          return { passed: false, message: "Logika zadania niepoprawna." };
      }
      if (typeof logicResult === "string") {
          return { passed: false, message: logicResult };
      }
      // Jeśli logicResult to true/null/undefined -> ok
  }

  // 6. Rozwiązanie (output)
  const solError = checkSolution(output, rozwiazanie);
  if (solError) return { passed: false, message: solError };

  return { passed: true, message: "Zadanie wykonane poprawnie!" };
};


