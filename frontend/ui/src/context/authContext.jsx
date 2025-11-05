import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userType, setUserType] = useState(null); //  new state

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const type = localStorage.getItem("userType"); //  load type
    if (token) {
      setIsAuthenticated(true);
      if (type) setUserType(type);
    }
  }, []);

  const login = (token, type) => {
    //  accept userType too
    localStorage.setItem("authToken", token);
    localStorage.setItem("userType", type);
    setIsAuthenticated(true);
    setUserType(type);
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userType");
    setIsAuthenticated(false);
    setUserType(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userType, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
