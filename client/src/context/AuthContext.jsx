import React, { createContext, useContext, useState, useEffect } from "react";
import API from "../api/axios"; // Your Axios instance with withCredentials: true

const AuthContext = createContext(null);

const normalizeUser = (userData) => {
  if (!userData) return userData;

  const normalizedId = userData._id ?? userData.id;

  return {
    ...userData,
    _id: normalizedId,
    id: normalizedId,
  };
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check auth status on initial page load / refresh
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await API.get("/auth/me");
        setUser(normalizeUser(response.data.user));
      } catch (err) {
        setUser(null); // Cookie expired or invalid
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const loginState = (userData) => {
    setUser(normalizeUser(userData));
  };

  const logoutState = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, loginState, logoutState }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

/* oxlint-disable react/only-export-components */
export const useAuth = () => useContext(AuthContext);
