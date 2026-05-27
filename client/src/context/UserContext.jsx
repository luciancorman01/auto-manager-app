import { createContext, useContext, useEffect, useState } from "react";
import api from "../api";

const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  const fetchUser = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoadingUser(false);
      return;
    }
    try {
      const res = await api.get("/auth/me");
      setUser(res.data);
    } catch {
      setUser(null);
    } finally {
      setLoadingUser(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  // Apelat după login/register ca să reîncărcăm userul
  const refreshUser = () => fetchUser();

  // Apelat la logout
  const clearUser = () => setUser(null);

  return (
    <UserContext.Provider value={{ user, loadingUser, refreshUser, clearUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
