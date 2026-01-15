import * as Blockly from "blockly";

// Formatuje XML Blockly - nadaje stałe ID, usuwa pozycje, formatuje wcięcia
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

        // Dodaj wszystkie atrybuty (zachowaj oryginalną kolejność)
        if (node.attributes && node.attributes.length > 0) {
          for (let i = 0; i < node.attributes.length; i++) {
            const attr = node.attributes[i];
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

// Normalizuje XML do porównania - usuwa ID, xmlns, spłaszcza strukturę
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

// Normalizuje nazwy zmiennych - zamienia na VAR1, VAR2, etc.
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

// Porównuje dwa XML po normalizacji
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

// Analizuje różnice między dwoma XML
const analyzeXmlDifferences = (generatedXml, expectedXml) => {
  const issues = [];

  // Słownik tłumaczeń typów bloków na polskie nazwy
  const blockTypeTranslations = {
    // Zmienne
    'variables_get': 'pobierz zmienną',
    'variables_set': 'ustaw zmienną',
    'math_change': 'zmień zmienną o',
    // Tekst
    'text': 'tekst',
    'text_print': 'wypisz',
    'text_join': 'połącz teksty',
    'text_length': 'długość tekstu',
    'text_changeCase': 'zmień wielkość liter',
    // Logiczne
    'controls_if': 'jeśli',
    'logic_compare': 'porównanie',
    'logic_operation': 'operacja logiczna',
    'logic_negate': 'negacja',
    'logic_boolean': 'prawda/fałsz',
    // Pętle
    'controls_repeat_ext': 'powtórz X razy',
    'controls_whileUntil': 'pętla while/until',
    'controls_for': 'pętla for',
    // Matematyczne
    'math_number': 'liczba',
    'math_arithmetic': 'działanie matematyczne',
    'math_single': 'funkcja matematyczna',
    'math_modulo': 'reszta z dzielenia',
    'math_random_int': 'losowa liczba',
    'math_round': 'zaokrąglij',
  };

  const translateBlockType = (type) => blockTypeTranslations[type] || type;

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
    const translatedMissing = uniqueMissing.map(translateBlockType);
    issues.push(`❌ Brakuje bloków: ${translatedMissing.join(', ')}`);
  }

  // Sprawdź dodatkowe typy bloków (które nie powinny być)
  const extraTypes = generatedTypes.filter(type => !expectedTypes.includes(type));
  if (extraTypes.length > 0) {
    const uniqueExtra = [...new Set(extraTypes)];
    const translatedExtra = uniqueExtra.map(translateBlockType);
    issues.push(`⚠️ Dodatkowe bloki (może nie są potrzebne): ${translatedExtra.join(', ')}`);
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


  if (generatedVars.length !== expectedVars.length) {
    issues.push(`❌ Nieprawidłowa liczba użycia zmiennych. Oczekiwano: ${expectedVars.length}, masz: ${generatedVars.length}`);
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

// Sprawdza czy XML zawiera blok math_random_int z określonym zakresem
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

// Walidacja zadań z blokiem math_random_int
const validateRandomIntTask = (generatedXml, expectedXml) => {
  if (!expectedXml.includes('type="math_random_int"')) {
    return null;
  }

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

  return null;
};

// Waliduje XML użytkownika porównując z oczekiwanym
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
  const randomIntResult = validateRandomIntTask(generatedXml, expectedXml);
  if (randomIntResult) {
    return randomIntResult;
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
    message += '- Sprawdź czy połączyłeś wszystkie bloki\n';
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



// Konwertuje workspace na XML string
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

// Główna funkcja walidacji - sprawdza TYLKO XML
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

  const xmlValidation = validateXml(generatedXml, expectedXml);

  if (xmlValidation.passed === false) {
    return xmlValidation;
  }

  if (xmlValidation.passed === true) {
    return { passed: true, message: 'Zadanie wykonane poprawnie! Bloki są identyczne z oczekiwanym rozwiązaniem.' };
  }

  // Fallback (nie powinno się zdarzyć)
  return { passed: false, message: 'Nieoczekiwany błąd walidacji.' };
};

