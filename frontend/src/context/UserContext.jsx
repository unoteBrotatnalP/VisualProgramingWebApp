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
        window.location.href = "/";
    };

    const login = async (token) => {
        localStorage.setItem("token", token);
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        await fetchUser();
    };

    return (
        <UserContext.Provider value={{ user, loading, fetchUser, login, logout }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    return useContext(UserContext);
}
