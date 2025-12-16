#!/usr/bin/env node

/**
 * Skrypt do automatycznego usuwania backticków z atrybutów XML
 * Użycie: node fix-xml.js
 */

const fs = require('fs');
const path = require('path');

// Usuń backticki z atrybutów id, x, y w XML
function removeBackticks(xml) {
  let cleaned = xml;
  let count = 0;
  
  // Usuń backticki (escape'owane i nieescape'owane) z atrybutów
  cleaned = cleaned.replace(/([xy]|id)\s*=\s*(["'])([^"']*?)([\\`])([^"']*?)(\2)/g, (m, attr, quote, before, backtick, after) => {
    count++;
    return `${attr}=${quote}${before}${after}${quote}`;
  });
  
  return { cleaned, count };
}

function processFile(filePath, fileName) {
  console.log(`\n🔧 ${fileName}`);
  
  let content = fs.readFileSync(filePath, 'utf8');
  let totalChanges = 0;
  
  // Znajdź wszystkie XML w template literals - szukamy końca template literal (backtick + przecinek/nawias)
  // Używamy prostszego podejścia: szukamy wzorca i ręcznie znajdujemy koniec
  const patterns = [
    { regex: /xml:\s*`/g, name: 'xml' },
    { regex: /expectedXml:\s*`/g, name: 'expectedXml' }
  ];
  
  patterns.forEach(({ regex, name }) => {
    let match;
    const replacements = [];
    
    while ((match = regex.exec(content)) !== null) {
      const start = match.index + match[0].length;
      // Znajdź koniec template literal (backtick po którym jest przecinek lub nawias)
      let end = start;
      let backslashCount = 0;
      
      while (end < content.length) {
        if (content[end] === '\\') {
          backslashCount++;
          end++;
          continue;
        }
        if (content[end] === '`' && backslashCount % 2 === 0) {
          // Sprawdź czy po backticku jest przecinek lub nawias
          const after = content.substring(end + 1).match(/^\s*[,\)]/);
          if (after) {
            replacements.push({ start: match.index, end: end + 1, xmlStart: start, xmlEnd: end });
            break;
          }
        }
        backslashCount = 0;
        end++;
      }
    }
    
    // Zastosuj zmiany od końca (żeby nie zmieniać indeksów)
    replacements.reverse().forEach(({ start, end, xmlStart, xmlEnd }) => {
      const xmlContent = content.substring(xmlStart, xmlEnd);
      const { cleaned, count } = removeBackticks(xmlContent);
      
      if (count > 0) {
        totalChanges += count;
        console.log(`   Usunięto ${count} backticków z ${name}`);
        content = content.substring(0, xmlStart) + cleaned + content.substring(xmlEnd);
      }
    });
  });
  
  if (totalChanges > 0) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`  Zapisano.`);
  } else {
    console.log(`  ℹ Brak zmian.`);
  }
  
  return totalChanges;
}

// Główna funkcja
console.log('🔧 Usuwanie backticków z XML...\n');

const files = [
  { path: path.join(__dirname, 'frontend', 'src', 'data', 'theoryData.js'), name: 'theoryData.js' },
  { path: path.join(__dirname, 'frontend', 'src', 'data', 'tasks.js'), name: 'tasks.js' }
];

let total = 0;
files.forEach(f => {
  if (fs.existsSync(f.path)) {
    total += processFile(f.path, f.name);
  }
});

console.log(`\n Gotowe! Usunięto ${total} backticków.`);

