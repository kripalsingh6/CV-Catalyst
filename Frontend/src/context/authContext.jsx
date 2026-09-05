/* eslint-disable react-refresh/only-export-components */
import axios from 'axios';
import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { API_BASE } from '../lib/axios';

const api = API_BASE;


const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [User, setUser] = useState(null);
  const [Loading, setLoading] = useState(true);

  const normalizeUser = (rawData) => {
    if (!rawData) return null;
    const u = rawData.user || rawData;
    return {
      ...u,
      subscription: u.subscription || u.plan || "free",
      plan: u.subscription || u.plan || "free",
    };
  };

  const fetchMe = useCallback(async () => {
    try {
      const res = await axios.get(`${api}/api/auth/getme`, {
        withCredentials: true
      });
      setUser(normalizeUser(res.data));
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    const init = async () => {
      try {
        const res = await axios.get(`${api}/api/auth/getme`, {
          withCredentials: true
        });
        if (active) {
          setUser(normalizeUser(res.data));
        }
      } catch {
        if (active) {
          setUser(null);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };
    init();
    return () => {
      active = false;
    };
  }, []);

  const Signup = async ({ name, email, password }) => {
    try {
      const res = await axios.post(
        `${api}/api/auth/signup`,
        { name, email, password },
        { withCredentials: true }
      );

      const normalized = normalizeUser(res.data);
      setUser(normalized);
      return res.data;

    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Signup failed",
        { cause: error }
      );
    }
  };

  const Login = async ({ email, password }) => {
    try {
      const res = await axios.post(
        `${api}/api/auth/login`,
        { email, password },
        { withCredentials: true }
      );

      const normalized = normalizeUser(res.data);
      setUser(normalized);
      return res.data;

    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Login failed",
        { cause: error }
      );
    }
  };

  const Logout = async () => {
    try {
      await axios.post(
        `${api}/api/auth/logout`,
        {},
        { withCredentials: true }
      );
    } catch (err) {
      console.warn("Logout request notice:", err.message);
    } finally {
      setUser(null);
    }
  };

  const isAuthenticated = Boolean(User);
  const isLoading = Loading;

  return (
    <AuthContext.Provider
      value={{ User, user: User, Loading, isLoading, isAuthenticated, fetchMe, Signup, Login, Logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
};