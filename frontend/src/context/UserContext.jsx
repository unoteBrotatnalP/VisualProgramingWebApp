import { createContext, useContext, useState, useEffect } from "react";
import api from "../lib/api";

const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }
      const { data } = await api.get("/auth/me");
      setUser(data.user);
    } catch (err) {
      console.error("Error fetching user:", err);
      // Jeśli błąd 401/403, to znaczy że token nieważny -> wyloguj
      if (err.response && (err.response.status === 401 || err.response.status === 403)) {
        localStorage.removeItem("token");
        localStorage.removeItem("email");
        setUser(null);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
    
    // Opcjonalnie: nasłuchiwanie na zmiany w localStorage (np. logowanie w innej karcie)
    const handleStorageChange = () => {
        fetchUser();
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    setUser(null);
    window.location.href = "/"; // Przeładowanie, żeby wyczyścić stan aplikacji
  };

  return (
    <UserContext.Provider value={{ user, loading, fetchUser, logout }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
