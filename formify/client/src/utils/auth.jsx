import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
const AuthContext = createContext(null);
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({ loading: true });
  const login = (user) => setUser(user);
  const logout = () => setUser(null);
  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("user")) || null;
    login(savedUser);
  }, []);

  const value = useMemo(() => {
    return { user, login, logout };
  }, [user]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};
