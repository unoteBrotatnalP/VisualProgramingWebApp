

import * as Blockly from "blockly";

/**
 * Normalizuje XML Blockly do porównania:
 * - Usuwa atrybuty id (są losowe)
 * - Usuwa atrybuty x, y (pozycje bloków)
 * - Normalizuje kolejność atrybutów
 * - Usuwa białe znaki
 * - Normalizuje nazwy zmiennych w field VAR
 * 
 * @param {string} xmlText - XML Blockly do normalizacji
 * @returns {string} Znormalizowany XML
 */
/**
 * Formatuje XML Blockly do czytelnej postaci (takiej jak w tasks.js).
 * - Nadaje stałe ID (var1, block1...)
 * - Usuwa pozycje x, y
 * - Formatuje wcięcia
 * - Zachowuje spacje w polach tekstowych
 * - Usuwa komentarze (ignoruje węzły COMMENT_NODE)
 * 
 * @param {string} xmlString - Surowy XML z Blockly
 * @returns {string} Sformatowany XML
 */
export const formatBlocklyXml = (xmlString) => {
  try {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, "text/xml");

    if (xmlDoc.documentElement.nodeName === "parsererror") {
      return xmlString;
    }

    // Najpierw przypisz nowe ID wszystkim elementom
    let varCounter = 1;
    let blockCounter = 1;
    let shadowCounter = 1;

    // Funkcja rekurencyjna do przypisania ID
    const assignIds = (node) => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        if (node.nodeName === "variable") {
          node.setAttribute("id", `var${varCounter++}`);
        } else if (node.nodeName === "block") {
          node.setAttribute("id", `block${blockCounter++}`);
        } else if (node.nodeName === "shadow") {
          node.setAttribute("id", `shadow${shadowCounter++}`);
        } else if (node.nodeName === "field") {
          // Usuń ID z field - nie są potrzebne
          node.removeAttribute("id");
        }

        // Usuń atrybuty x, y, collapsed, disabled, deletable, movable, editable
        // To zapewnia czysty XML do porównania
        const attrsToRemove = ['x', 'y', 'collapsed', 'disabled', 'deletable', 'movable', 'editable'];
        attrsToRemove.forEach(attr => node.removeAttribute(attr));

        // Przetwórz dzieci
        Array.from(node.childNodes).forEach(child => {
          if (child.nodeType === Node.ELEMENT_NODE) {
            assignIds(child);
          }
        });
      }
    };

    // Przypisz ID wszystkim elementom
    assignIds(xmlDoc.documentElement);

    // Funkcja formatująca węzły
    const formatNode = (node, indent = "") => {
      let result = "";
      const indentStep = "  ";

      if (node.nodeType === Node.ELEMENT_NODE) {
        result += indent + "<" + node.nodeName;

        // Dodaj wszystkie atrybuty (w tym nowe ID)
        if (node.attributes && node.attributes.length > 0) {
          // Sortuj atrybuty dla determinizmu (opcjonalne, ale dobre dla porównywania)
          const sortedAttrs = Array.from(node.attributes).sort((a, b) => a.name.localeCompare(b.name));

          for (const attr of sortedAttrs) {
            result += ' ' + attr.name + '="' + attr.value + '"';
          }
        }

        // Sprawdź czy węzeł ma dzieci będące elementami
        const hasElementChildren = Array.from(node.childNodes).some(n => n.nodeType === Node.ELEMENT_NODE);

        let children;
        if (hasElementChildren) {
          // Jeśli węzeł ma strukturę (inne tagi), filtrujemy puste węzły tekstowe (wcięcia)
          children = Array.from(node.childNodes).filter(
            (n) =>
              n.nodeType === Node.ELEMENT_NODE ||
              (n.nodeType === Node.TEXT_NODE && n.textContent.trim())
          );
        } else {
          // Jeśli to węzeł liść (np. field z tekstem), bierzemy wszystko jak leci
          children = Array.from(node.childNodes);
        }

        if (children.length === 0) {
          result += " />\n";
        } else {
          if (!hasElementChildren) {
            // Węzeł tekstowy (liść) - wypisz w jednej linii, zachowując spacje
            result += ">";
            result += node.textContent; // Zachowaj oryginalny tekst (w tym spacje)
            result += "</" + node.nodeName + ">\n";
          } else {
            // Węzeł strukturalny - formatuj z wcięciami
            result += ">\n";

            for (const child of children) {
              if (child.nodeType === Node.ELEMENT_NODE) {
                result += formatNode(child, indent + indentStep);
              } else if (
                child.nodeType === Node.TEXT_NODE &&
                child.textContent.trim()
              ) {
                result += indent + indentStep + child.textContent.trim() + "\n";
              }
            }

            result += indent + "</" + node.nodeName + ">\n";
          }
        }
      } else if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
        result += indent + node.textContent.trim() + "\n";
      }

      return result;
    };

    const root = xmlDoc.documentElement;
    let formatted = formatNode(root, "");

    return formatted.trim();
  } catch (e) {
    console.warn("Błąd formatowania XML:", e);
    return xmlString;
  }
};

/**
 * Normalizuje XML Blockly do porównania:
 * - Używa formatBlocklyXml do "wyczyszczenia" i ustandaryzowania XML
 * - Usuwa atrybuty id (są losowe lub sekwencyjne, walidacja je ignoruje)
 * - Usuwa xmlns z tagów wewnętrznych
 * - Spłaszcza strukturę (usuwa wcięcia dla łatwiejszego porównania stringów)
 * 
 * @param {string} xmlText - XML Blockly do normalizacji
 * @returns {string} Znormalizowany XML
 */
export const normalizeXml = (xmlText) => {
  if (!xmlText || typeof xmlText !== 'string') return '';

  // KROK 1: Użyj wspólnego formatera, aby wyczyścić atrybuty (x, y, disabled...) 
  // i sformatować XML w przewidywalny sposób.
  // Dzięki temu mamy pewność, że generator (UI) i validator widzą to samo.
  let normalized = formatBlocklyXml(xmlText);

  // KROK 2: Usuń atrybuty id="..." 
  // (FormatBlocklyXml nadaje je jako var1, var2..., ale walidacja powinna ignorować konkretne numery ID)
  normalized = normalized.replace(/\s+id=["'][^"']*["']/g, '');

  // KROK 3: Obsługa xmlns (zostaw tylko w root)
  normalized = normalized.replace(/\s+xmlns=["'][^"']*["']/g, '');
  if (!normalized.includes('<xml')) {
    normalized = normalized.replace(/^<xml/, '<xml xmlns="https://developers.google.com/blockly/xml"');
  } else if (!normalized.includes('xmlns=')) {
    normalized = normalized.replace(/^<xml\s/, '<xml xmlns="https://developers.google.com/blockly/xml" ');
  }

  // KROK 4: Spłaszcz strukturę do porównania (usuń wcięcia dodane przez formatBlocklyXml)
  // Usuń białe znaki między tagami (>\s+< -> ><)
  // UWAGA: formatBlocklyXml dba o to, by spacje wewnątrz tekstów były bezpieczne (nie są "między tagami" w sensie struktury)
  normalized = normalized.replace(/>\s+</g, '><');

  // Normalizuj puste tagi <tag></tag> -> <tag/> (dla pewności)
  normalized = normalized.replace(/<([^\s>\/]+)([^>]*)><\/\1>/g, '<$1$2/>');
  normalized = normalized.replace(/\s+\/>/g, '/>');

  return normalized.trim();
};

/**
 * Normalizuje nazwy zmiennych w XML Blockly.
 * Zamienia nazwy zmiennych na placeholder VAR1, VAR2, etc.
 * 
 * @param {string} xmlText - XML Blockly
 * @returns {string} XML z znormalizowanymi nazwami zmiennych
 */
export const normalizeVariableNames = (xmlText) => {
  if (!xmlText || typeof xmlText !== 'string') return '';

  const variableMap = new Map();
  let varCounter = 1;

  // Znajdź wszystkie wystąpienia <field name="VAR">nazwa_zmiennej</field>
  // Ulepszony regex, który ignoruje białe znaki wokół wartości
  const varFieldPattern = /<field[^>]*name=["']VAR["'][^>]*>\s*([^<]+?)\s*<\/field>/g;
  let match;

  while ((match = varFieldPattern.exec(xmlText)) !== null) {
    const varName = match[1].trim(); // trim() jest kluczowy
    if (!variableMap.has(varName)) {
      variableMap.set(varName, `VAR${varCounter++}`);
    }
  }

  // Zamień wszystkie wystąpienia nazw zmiennych
  let normalized = xmlText;
  variableMap.forEach((placeholder, varName) => {
    // Escapowanie nazwy zmiennej do regex
    const escapedVarName = varName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    // Regex, który dopasowuje pole z tą konkretną nazwą, dopuszczając białe znaki
    normalized = normalized.replace(
      new RegExp(`<field([^>]*)name=["']VAR["']([^>]*)>\\s*${escapedVarName}\\s*<\\/field>`, 'g'),
      `<field$1name="VAR"$2>${placeholder}</field>`
    );
  });

  return normalized;
};

/**
 * Porównuje dwa XML Blockly po normalizacji.
 * 
 * @param {string} generatedXml - XML wygenerowany z workspace użytkownika
 * @param {string} expectedXml - Oczekiwany XML referencyjny
 * @returns {boolean} true jeśli XML są identyczne po normalizacji
 */
export const compareXml = (generatedXml, expectedXml) => {
  if (!expectedXml) return null; // Brak oczekiwanego XML = nie sprawdzamy

  // Najpierw normalizuj nazwy zmiennych
  const normalizedGenerated = normalizeVariableNames(generatedXml);
  const normalizedExpected = normalizeVariableNames(expectedXml);

  // Potem normalizuj XML (usuń id, pozycje, itp.)
  const finalGenerated = normalizeXml(normalizedGenerated);
  const finalExpected = normalizeXml(normalizedExpected);

  return finalGenerated === finalExpected;
};

/**
 * Analizuje różnice między dwoma XML i zwraca szczegółowe informacje.
 * 
 * @param {string} generatedXml - XML wygenerowany przez użytkownika
 * @param {string} expectedXml - Oczekiwany XML
 * @returns {object} Obiekt z informacjami o różnicach
 */
const analyzeXmlDifferences = (generatedXml, expectedXml) => {
  const issues = [];

  // Parsuj XML do obiektów (uproszczone)
  const extractBlockTypes = (xml) => {
    const matches = xml.match(/type="([^"]+)"/g) || [];
    return matches.map(m => m.replace(/type="([^"]+)"/, '$1'));
  };

  // Wyciągnij wartości z pól
  const extractFieldValues = (xml, fieldName) => {
    try {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xml, 'text/xml');

      // Sprawdź błędy parsowania
      if (xmlDoc.documentElement.nodeName === 'parsererror') {
        return [];
      }

      // Znajdź wszystkie elementy field rekurencyjnie
      const findAllFields = (node) => {
        const results = [];
        if (node.nodeType === Node.ELEMENT_NODE) {
          if (node.nodeName === 'field' && node.getAttribute('name') === fieldName) {
            // Sprawdź czy field zawiera tylko tekst (nie ma zagnieżdżonych elementów)
            const hasChildElements = Array.from(node.childNodes).some(
              child => child.nodeType === Node.ELEMENT_NODE
            );
            if (!hasChildElements) {
              const textContent = node.textContent.trim();
              if (textContent) {
                results.push(textContent);
              }
            }
          }
          // Przeszukaj dzieci rekurencyjnie
          Array.from(node.childNodes).forEach(child => {
            results.push(...findAllFields(child));
          });
        }
        return results;
      };

      return findAllFields(xmlDoc.documentElement);
    } catch (e) {
      console.warn('Błąd ekstrahowania pól:', e);
      return [];
    }
  };

  // Wyciągnij liczby
  const extractNumbers = (xml) => {
    const regex = /<field\s+name="NUM">([^<]+)<\/field>/g;
    const matches = [];
    let match;
    while ((match = regex.exec(xml)) !== null) {
      matches.push(match[1].trim());
    }
    return matches;
  };

  // Wyciągnij teksty
  const extractTexts = (xml) => {
    const regex = /<field\s+name="TEXT">([^<]*)<\/field>/g;
    const matches = [];
    let match;
    while ((match = regex.exec(xml)) !== null) {
      matches.push(match[1].trim());
    }
    return matches;
  };

  const generatedTypes = extractBlockTypes(generatedXml);
  const expectedTypes = extractBlockTypes(expectedXml);

  // Sprawdź brakujące typy bloków
  const missingTypes = expectedTypes.filter(type => !generatedTypes.includes(type));
  if (missingTypes.length > 0) {
    const uniqueMissing = [...new Set(missingTypes)];
    issues.push(`❌ Brakuje bloków typu: ${uniqueMissing.join(', ')}`);
  }

  // Sprawdź dodatkowe typy bloków (które nie powinny być)
  const extraTypes = generatedTypes.filter(type => !expectedTypes.includes(type));
  if (extraTypes.length > 0) {
    const uniqueExtra = [...new Set(extraTypes)];
    issues.push(`⚠️ Dodatkowe bloki (może nie są potrzebne): ${uniqueExtra.join(', ')}`);
  }

  // Sprawdź liczby
  const generatedNumbers = extractNumbers(generatedXml);
  const expectedNumbers = extractNumbers(expectedXml);
  if (generatedNumbers.length !== expectedNumbers.length) {
    issues.push(`❌ Nieprawidłowa liczba wartości liczbowych. Oczekiwano: ${expectedNumbers.length}, masz: ${generatedNumbers.length}`);
  } else {
    const wrongNumbers = [];
    expectedNumbers.forEach((expectedNum, idx) => {
      if (generatedNumbers[idx] !== expectedNum) {
        wrongNumbers.push(`Oczekiwano: ${expectedNum}, masz: ${generatedNumbers[idx] || 'brak'}`);
      }
    });
    if (wrongNumbers.length > 0) {
      issues.push(`❌ Nieprawidłowe wartości liczbowe:\n   ${wrongNumbers.join('\n   ')}`);
    }
  }

  // Sprawdź teksty (pomijając puste)
  const generatedTexts = extractTexts(generatedXml).filter(t => t.length > 0);
  const expectedTexts = extractTexts(expectedXml).filter(t => t.length > 0);
  if (generatedTexts.length !== expectedTexts.length) {
    issues.push(`❌ Nieprawidłowa liczba wartości tekstowych. Oczekiwano: ${expectedTexts.length}, masz: ${generatedTexts.length}`);
  } else {
    const wrongTexts = [];
    expectedTexts.forEach((expectedText, idx) => {
      if (generatedTexts[idx] !== expectedText) {
        wrongTexts.push(`Oczekiwano: "${expectedText}", masz: "${generatedTexts[idx] || 'brak'}"`);
      }
    });
    if (wrongTexts.length > 0) {
      issues.push(`❌ Nieprawidłowe wartości tekstowe:\n   ${wrongTexts.join('\n   ')}`);
    }
  }

  // Sprawdź zmienne
  const generatedVars = extractFieldValues(generatedXml, 'VAR');
  const expectedVars = extractFieldValues(expectedXml, 'VAR');

  // Debug logging
  console.log('DEBUG extractFieldValues VAR:');
  console.log('Generated XML vars:', generatedVars);
  console.log('Expected XML vars:', expectedVars);
  console.log('Generated XML sample:', generatedXml.substring(0, 500));
  console.log('Expected XML sample:', expectedXml.substring(0, 500));

  if (generatedVars.length !== expectedVars.length) {
    issues.push(`❌ Nieprawidłowa liczba zmiennych. Oczekiwano: ${expectedVars.length}, masz: ${generatedVars.length}`);
  } else if (generatedVars.length > 0 && expectedVars.length > 0) {
    // Sprawdź czy wartości są takie same (po normalizacji powinny być VAR1, VAR2, etc.)
    const wrongVars = [];
    expectedVars.forEach((expectedVar, idx) => {
      if (generatedVars[idx] !== expectedVar) {
        wrongVars.push(`Oczekiwano: "${expectedVar}", masz: "${generatedVars[idx] || 'brak'}"`);
      }
    });
    if (wrongVars.length > 0) {
      issues.push(`❌ Nieprawidłowe nazwy zmiennych:\n   ${wrongVars.join('\n   ')}`);
    }
  }

  // Sprawdź operatory (dla bloków logicznych i matematycznych)
  const extractOperators = (xml) => {
    const regex = /<field\s+name="(OP|MODE|CASE)">([^<]+)<\/field>/g;
    const matches = [];
    let match;
    while ((match = regex.exec(xml)) !== null) {
      matches.push({ field: match[1], value: match[2].trim() });
    }
    return matches;
  };

  const generatedOps = extractOperators(generatedXml);
  const expectedOps = extractOperators(expectedXml);
  if (generatedOps.length !== expectedOps.length) {
    issues.push(`❌ Nieprawidłowa liczba operatorów/wartości logicznych. Oczekiwano: ${expectedOps.length}, masz: ${generatedOps.length}`);
  } else {
    const wrongOps = [];
    expectedOps.forEach((expectedOp, idx) => {
      const generatedOp = generatedOps[idx];
      if (!generatedOp || generatedOp.value !== expectedOp.value) {
        wrongOps.push(`Pole ${expectedOp.field}: oczekiwano "${expectedOp.value}", masz "${generatedOp?.value || 'brak'}"`);
      }
    });
    if (wrongOps.length > 0) {
      issues.push(`❌ Nieprawidłowe operatory/wartości:\n   ${wrongOps.join('\n   ')}`);
    }
  }

  // Sprawdź liczbę bloków (ogólna struktura)
  const countBlocks = (xml) => {
    return (xml.match(/<block\s+type=/g) || []).length;
  };

  const generatedBlockCount = countBlocks(generatedXml);
  const expectedBlockCount = countBlocks(expectedXml);
  if (generatedBlockCount !== expectedBlockCount) {
    issues.push(`❌ Nieprawidłowa liczba bloków. Oczekiwano: ${expectedBlockCount}, masz: ${generatedBlockCount}`);
  }

  return {
    issues,
    hasIssues: issues.length > 0
  };
};

/**
 * Sprawdza czy XML zawiera blok math_random_int z określonym zakresem.
 * 
 * @param {string} xml - XML do sprawdzenia
 * @param {number} from - Minimalna wartość zakresu
 * @param {number} to - Maksymalna wartość zakresu
 * @returns {boolean} true jeśli blok math_random_int ma poprawny zakres
 */
const validateRandomIntRange = (xml, from, to) => {
  // Sprawdź czy jest blok math_random_int
  if (!xml.includes('type="math_random_int"')) {
    return false;
  }

  // Wyciągnij wartości FROM i TO z bloku math_random_int
  const fromMatch = xml.match(/<value\s+name="FROM">[\s\S]*?<field\s+name="NUM">(\d+)<\/field>/);
  const toMatch = xml.match(/<value\s+name="TO">[\s\S]*?<field\s+name="NUM">(\d+)<\/field>/);

  if (!fromMatch || !toMatch) {
    return false;
  }

  const fromValue = parseInt(fromMatch[1], 10);
  const toValue = parseInt(toMatch[1], 10);

  return fromValue === from && toValue === to;
};

/**
 * Waliduje XML użytkownika porównując go z oczekiwanym XML.
 * 
 * @param {string} generatedXml - XML wygenerowany z workspace użytkownika
 * @param {string} expectedXml - Oczekiwany XML referencyjny z tasks.js
 * @returns {object} { passed: boolean, message: string | null }
 */
export const validateXml = (generatedXml, expectedXml) => {
  if (!expectedXml) {
    return { passed: null, message: null };
  }

  if (!generatedXml || generatedXml.trim().length === 0) {
    return {
      passed: false,
      message: 'Brak bloków do sprawdzenia. Ułóż bloki w workspace.'
    };
  }

  // Specjalna obsługa dla zadań z losową liczbą (math_random_int)
  // Sprawdź czy oczekiwany XML zawiera math_random_int
  if (expectedXml.includes('type="math_random_int"')) {
    // Wyciągnij zakres z oczekiwanego XML
    const expectedFromMatch = expectedXml.match(/<value\s+name="FROM">[\s\S]*?<field\s+name="NUM">(\d+)<\/field>/);
    const expectedToMatch = expectedXml.match(/<value\s+name="TO">[\s\S]*?<field\s+name="NUM">(\d+)<\/field>/);

    if (expectedFromMatch && expectedToMatch) {
      const expectedFrom = parseInt(expectedFromMatch[1], 10);
      const expectedTo = parseInt(expectedToMatch[1], 10);

      // Sprawdź czy użytkownik użył bloku math_random_int z poprawnym zakresem
      if (!validateRandomIntRange(generatedXml, expectedFrom, expectedTo)) {
        return {
          passed: false,
          message: `❌ Nieprawidłowe rozwiązanie.\n\n` +
            `Użyj bloku "losowa liczba" z zakresem od ${expectedFrom} do ${expectedTo}.\n` +
            `Blok powinien być wewnątrz bloku "wypisz".`
        };
      }

      // Sprawdź czy jest blok text_print
      if (!generatedXml.includes('type="text_print"')) {
        return {
          passed: false,
          message: '❌ Brakuje bloku "wypisz". Użyj bloku "wypisz", aby wyświetlić wylosowaną liczbę.'
        };
      }

      // Sprawdź czy math_random_int jest wewnątrz text_print
      const printMatch = generatedXml.match(/<block\s+type="text_print"[\s\S]*?<\/block>/);
      if (printMatch && printMatch[0].includes('type="math_random_int"')) {
        return {
          passed: true,
          message: '✅ Zadanie wykonane poprawnie! Użyłeś bloku "losowa liczba" z poprawnym zakresem.'
        };
      } else {
        return {
          passed: false,
          message: '❌ Blok "losowa liczba" powinien być wewnątrz bloku "wypisz".'
        };
      }
    }
  }

  const isMatch = compareXml(generatedXml, expectedXml);

  if (isMatch) {
    return {
      passed: true,
      message: 'Bloki są identyczne z oczekiwanym rozwiązaniem!'
    };
  } else {
    // Analizuj różnice - najpierw znormalizuj nazwy zmiennych
    const normalizedGenerated = normalizeVariableNames(generatedXml);
    const normalizedExpected = normalizeVariableNames(expectedXml);
    const analysis = analyzeXmlDifferences(normalizedGenerated, normalizedExpected);

    let message = '❌ Bloki nie pasują do oczekiwanego rozwiązania.\n\n';

    if (analysis.hasIssues) {
      message += 'Znalezione problemy:\n\n';
      message += analysis.issues.join('\n\n');
      message += '\n\n';
    }

    message += '💡 Wskazówki:\n';
    message += '- Sprawdź czy użyłeś poprawnych nazw zmiennych (zgodnie z opisem zadania)\n';
    message += '- Sprawdź czy kolejność bloków jest prawidłowa\n';
    message += '- Sprawdź czy wszystkie wartości (liczby, teksty) są poprawne\n';
    message += '- Sprawdź czy użyłeś właściwych typów bloków\n';
    message += '- Sprawdź czy nie brakuje żadnych bloków\n';

    return {
      passed: false,
      message
    };
  }
};



/**
 * Konwertuje Blockly workspace na XML string.
 * 
 * @param {object} workspace - Instancja Blockly workspace
 * @returns {string} XML string reprezentujący workspace
 */
export const workspaceToXml = (workspace) => {
  if (!workspace) return '';

  try {
    const xml = Blockly.Xml.workspaceToDom(workspace);
    const xmlText = Blockly.Xml.domToText(xml);
    return xmlText;
  } catch (error) {
    console.error('Błąd konwersji workspace na XML:', error);
    return '';
  }
};

/**
 * Główna funkcja walidacji - sprawdza TYLKO XML, nie output.
 * 
 * @param {object} workspace - Instancja Blockly workspace
 * @param {object} task - Obiekt zadania z konfiguracją
 * @param {string} output - Wynik wykonania kodu (tekst z konsoli) - nieużywany, tylko dla kompatybilności
 * @param {string} generatedCode - Wygenerowany kod JavaScript - nieużywany, tylko dla kompatybilności
 * @returns {object} { passed: boolean, message: string | null }
 */
export const validateTaskByXml = (workspace, task, output, generatedCode) => {
  const { expectedXml } = task;

  // Walidacja TYLKO na podstawie XML
  if (!expectedXml) {
    return {
      passed: false,
      message: 'Brak kryteriów walidacji. Zadanie nie ma zdefiniowanego oczekiwanego XML (expectedXml).'
    };
  }

  // Konwertuj workspace na XML
  const generatedXml = workspaceToXml(workspace);

  if (!generatedXml || generatedXml.trim().length === 0) {
    return {
      passed: false,
      message: 'Brak bloków do sprawdzenia. Ułóż bloki w workspace.'
    };
  }

  // Debugowanie - loguj XML do konsoli
  console.log('Wygenerowany XML:', generatedXml);
  console.log('Oczekiwany XML:', expectedXml);

  const xmlValidation = validateXml(generatedXml, expectedXml);

  // Loguj znormalizowane XML dla debugowania
  if (!xmlValidation.passed) {
    const normalizedGenerated = normalizeVariableNames(generatedXml);
    const normalizedExpected = normalizeVariableNames(expectedXml);
    const finalGenerated = normalizeXml(normalizedGenerated);
    const finalExpected = normalizeXml(normalizedExpected);
    console.log('Znormalizowany wygenerowany XML:', finalGenerated);
    console.log('Znormalizowany oczekiwany XML:', finalExpected);
  }

  if (xmlValidation.passed === false) {
    return xmlValidation;
  }

  if (xmlValidation.passed === true) {
    return { passed: true, message: 'Zadanie wykonane poprawnie! Bloki są identyczne z oczekiwanym rozwiązaniem.' };
  }

  // Fallback (nie powinno się zdarzyć)
  return { passed: false, message: 'Nieoczekiwany błąd walidacji.' };
};

