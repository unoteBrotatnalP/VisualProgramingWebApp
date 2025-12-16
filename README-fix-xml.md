# Skrypt do naprawiania XML

## Opis

Prosty skrypt Node.js, który automatycznie usuwa backticki z atrybutów XML w plikach `theoryData.js` i `tasks.js`.

## Użycie

```bash
node fix-xml.js
```

## Co robi skrypt?

1. Czyta pliki:
   - `frontend/src/data/theoryData.js` (wzorzec: `xml: \`...\``)
   - `frontend/src/data/tasks.js` (wzorzec: `expectedXml: \`...\``)
2. Znajduje wszystkie wystąpienia XML w obu formatach
3. W każdym XML usuwa backticki z atrybutów `id`, `x`, `y` (są niepotrzebne)
4. Zapisuje z powrotem do plików

## Przykłady

### theoryData.js

**Przed:**
```javascript
xml: `<xml>
  <block id="test`id">...</block>
</xml>`
```

**Po:**
```javascript
xml: `<xml>
  <block id="testid">...</block>
</xml>`
```

### tasks.js

**Przed:**
```javascript
expectedXml: `<xml>
  <block id="test`id">...</block>
</xml>`
```

**Po:**
```javascript
expectedXml: `<xml>
  <block id="testid">...</block>
</xml>`
```

## Kiedy używać?

- Po wklejeniu XML z Blockly, który zawiera backticki w ID
- Gdy edytor pokazuje błędy składniowe związane z backtickami
- Przed commitem zmian do plików `theoryData.js` lub `tasks.js`

## Uwaga

Skrypt automatycznie usuwa backticki z atrybutów `id`, `x`, `y` w tagach XML. Te atrybuty są i tak usuwane przez funkcję `cleanBlocklyXml` w `Theory.jsx`, więc backticki w nich są niepotrzebne.

