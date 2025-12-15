

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
export const normalizeXml = (xmlText) => {
  if (!xmlText || typeof xmlText !== 'string') return '';
  
  let normalized = xmlText.trim();
  
  // Usuń komentarze XML
  normalized = normalized.replace(/<!--[\s\S]*?-->/g, '');
  
  // Parsuj XML jako string i usuń niepotrzebne atrybuty
  // Usuń atrybuty id="..." (są losowe) - może być id='...' lub id="..."
  normalized = normalized.replace(/\s+id=["'][^"']*["']/g, '');
  
  // Usuń atrybuty x="..." i y="..." (pozycje bloków)
  normalized = normalized.replace(/\s+x=["'][^"']*["']/g, '');
  normalized = normalized.replace(/\s+y=["'][^"']*["']/g, '');
  
  // Usuń atrybuty collapsed="..." (stan zwinięcia)
  normalized = normalized.replace(/\s+collapsed=["'][^"']*["']/g, '');
  
  // Usuń atrybuty deletable="...", movable="...", editable="..." (opcje bloków)
  normalized = normalized.replace(/\s+deletable=["'][^"']*["']/g, '');
  normalized = normalized.replace(/\s+movable=["'][^"']*["']/g, '');
  normalized = normalized.replace(/\s+editable=["'][^"']*["']/g, '');
  
  // Usuń atrybuty disabled="..." (zablokowane bloki)
  normalized = normalized.replace(/\s+disabled=["'][^"']*["']/g, '');
  
  // Usuń xmlns z tagów wewnętrznych (zostaw tylko w głównym tagu xml)
  normalized = normalized.replace(/\s+xmlns=["'][^"']*["']/g, '');
  // Ale dodaj z powrotem do głównego tagu xml jeśli go nie ma
  if (!normalized.includes('<xml')) {
    normalized = normalized.replace(/^<xml/, '<xml xmlns="https://developers.google.com/blockly/xml"');
  } else if (!normalized.includes('xmlns=')) {
    normalized = normalized.replace(/^<xml\s/, '<xml xmlns="https://developers.google.com/blockly/xml" ');
  }
  
  // Normalizuj białe znaki - zamień wiele białych znaków na pojedyncze spacje
  normalized = normalized.replace(/\s+/g, ' ');
  
  // Usuń białe znaki przed i po tagach
  normalized = normalized.replace(/>\s+</g, '><');
  
  // Usuń białe znaki na początku i końcu
  normalized = normalized.trim();
  
  return normalized;
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
  const varFieldPattern = /<field\s+name="VAR">([^<]+)<\/field>/g;
  let match;
  
  while ((match = varFieldPattern.exec(xmlText)) !== null) {
    const varName = match[1].trim();
    if (!variableMap.has(varName)) {
      variableMap.set(varName, `VAR${varCounter++}`);
    }
  }
  
  // Zamień wszystkie wystąpienia nazw zmiennych
  let normalized = xmlText;
  variableMap.forEach((placeholder, varName) => {
    // Zamień w field VAR
    normalized = normalized.replace(
      new RegExp(`<field\\s+name="VAR">${varName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}<\\/field>`, 'g'),
      `<field name="VAR">${placeholder}</field>`
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
    const regex = new RegExp(`<field\\s+name="${fieldName}">([^<]+)</field>`, 'g');
    const matches = [];
    let match;
    while ((match = regex.exec(xml)) !== null) {
      matches.push(match[1].trim());
    }
    return matches;
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
    issues.push(`⚠️ Dodatkowe bloki (może n5ie są potrzebne): ${uniqueExtra.join(', ')}`);
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
    issues.push(`❌ Nieprawidłowa liczba zmiennych. Oczekiwano: ${expectedVars.length}, masz: ${generatedVars.length}`);
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
  
  const isMatch = compareXml(generatedXml, expectedXml);
  
  if (isMatch) {
    return { 
      passed: true, 
      message: 'Bloki są identyczne z oczekiwanym rozwiązaniem!' 
    };
  } else {
    // Analizuj różnice
    const analysis = analyzeXmlDifferences(generatedXml, expectedXml);
    
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

