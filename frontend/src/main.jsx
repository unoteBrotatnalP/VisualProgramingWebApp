import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import App from "./App.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import "./index.css";
import BlocklyDemo from "./pages/BlocklyDemo.jsx";
import BlocklyTasks from "./pages/BlocklyTasks.jsx";


ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <nav style={{ display: "flex", gap: "1rem", padding: "1rem" }}>
        <Link to="/">Home</Link>
        <Link to="/login">Logowanie</Link>
        <Link to="/register">Rejestracja</Link>
        <Link to="/blockly">Blockly</Link>

      </nav>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/blockly" element={<BlocklyTasks />} />
        <Route path="/blockly/:id" element={<BlocklyDemo />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
