import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import "./index.css";
import BlocklyDemo from "./pages/BlocklyDemo.jsx";
import BlocklyTasks from "./pages/BlocklyTasks.jsx";
import BlocklyGenerator from "./pages/BlocklyGenerator.jsx";
import Header from "./pages/Header.jsx";
import Theory from "./pages/Theory.jsx";
import { setAuthToken } from "./lib/api";
import Settings from "./pages/Settings.jsx";
import { UserProvider } from "./context/UserContext.jsx";
import Trophies from "./pages/Trophies.jsx";


const savedToken = localStorage.getItem("token");
if (savedToken) {
  setAuthToken(savedToken);
}

function MainApp() {
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    window.location.reload();
  };

  return (
    <>
      <Header logout={handleLogout} /> {/*  Header teraz tu, nad Routes */}
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/theory" element={<Theory />} />
        <Route path="/blockly" element={<BlocklyTasks />} />
        <Route path="/blockly/:id" element={<BlocklyDemo />} />
        <Route path="/generator" element={<BlocklyGenerator />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/trophies" element={<Trophies />} />
      </Routes>
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <UserProvider>
      <BrowserRouter>
        <MainApp />
      </BrowserRouter>
    </UserProvider>
  </React.StrictMode>
);
