import React, { useState, useEffect, useRef } from "react";
import "./VariableKom.css";

function VariableKom({ isOpen, onClose, onConfirm, title = "Utwórz zmienną", placeholder = "Nazwa zmiennej", defaultValue = "", isRename = false }) {
  const [variableName, setVariableName] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
      setVariableName(defaultValue || "");
    }
  }, [isOpen, defaultValue]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    const handleEnter = (e) => {
      if (e.key === "Enter" && isOpen && variableName.trim() && !variableName.includes(" ")) {
        handleConfirm();
      }
    };
    document.addEventListener("keydown", handleEscape);
    document.addEventListener("keydown", handleEnter);
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.removeEventListener("keydown", handleEnter);
    };
  }, [isOpen, variableName, onClose]);

  const handleConfirm = () => {
    const trimmed = variableName.trim();
    if (trimmed && !trimmed.includes(" ")) {
      onConfirm(trimmed);
      setVariableName("");
      onClose();
    }
  };

  const isValid = variableName.trim() && !variableName.trim().includes(" ");

  if (!isOpen) return null;

  return (
    <div className="variable-kom-overlay" onClick={onClose}>
      <div className="variable-kom-content" onClick={(e) => e.stopPropagation()}>
        <div className="variable-kom-header">
          <h3 className="variable-kom-title">{title}</h3>
          <button className="variable-kom-close" onClick={onClose} aria-label="Zamknij">
            ×
          </button>
        </div>
        <div className="variable-kom-body">
          <label className="variable-kom-label">Podaj nazwę zmiennej:</label>
          <input
            ref={inputRef}
            type="text"
            className={`variable-kom-input ${variableName.trim() && variableName.includes(" ") ? "variable-kom-input-error" : ""}`}
            value={variableName}
            onChange={(e) => setVariableName(e.target.value)}
            placeholder={placeholder}
            autoFocus
          />
          {variableName.trim() && variableName.includes(" ") ? (
            <p className="variable-kom-hint variable-kom-hint-error">
              ⚠️ Nazwa zmiennej nie może zawierać spacji.
            </p>
          ) : (
            <p className="variable-kom-hint">Wprowadź nazwę zmiennej (bez spacji).</p>
          )}
        </div>
        <div className="variable-kom-footer">
          <button className="variable-kom-btn variable-kom-btn-cancel" onClick={onClose}>
            Anuluj
          </button>
          <button
            className="variable-kom-btn variable-kom-btn-confirm"
            onClick={handleConfirm}
            disabled={!isValid}
          >
            {isRename ? "Zmień" : "Utwórz"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default VariableKom;



