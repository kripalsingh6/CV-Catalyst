<<<<<<< HEAD
import axios from 'axios';
import { createContext, useContext, useEffect, useState } from 'react';
=======
/* eslint-disable react-refresh/only-export-components */
import axios from 'axios';
import { createContext, useContext, useEffect, useState, useCallback } from 'react';
>>>>>>> b0593b4 (some change)

const api = "http://localhost:3000";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [User, setUser] = useState(null);
  const [Loading, setLoading] = useState(true);

<<<<<<< HEAD
  useEffect(() => {
    fetchMe();
  }, []);

  const fetchMe = async () => {
    try {
      const res = await axios.get(`${api}/api/getme`, {
        withCredentials: true
      });
      setUser(res.data.user); // 
=======
  const fetchMe = useCallback(async () => {
    try {
      const res = await axios.get(`${api}/api/auth/getme`, {
        withCredentials: true
      });
      setUser(res.data.user || res.data);
>>>>>>> b0593b4 (some change)
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
<<<<<<< HEAD
  };
=======
  }, []);

  useEffect(() => {
    let active = true;
    const init = async () => {
      try {
        const res = await axios.get(`${api}/api/auth/getme`, {
          withCredentials: true
        });
        if (active) {
          setUser(res.data.user || res.data);
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
>>>>>>> b0593b4 (some change)

  const Signup = async ({ name, email, password }) => {
    try {
      const res = await axios.post(
<<<<<<< HEAD
        `${api}/api/signup`,
=======
        `${api}/api/auth/signup`,
>>>>>>> b0593b4 (some change)
        { name, email, password },
        { withCredentials: true }
      );

      setUser(res.data.user);
      return res.data;

    } catch (error) {
      throw new Error(
<<<<<<< HEAD
        error.response?.data?.message || "Signup failed"
=======
        error.response?.data?.message || "Signup failed",
        { cause: error }
>>>>>>> b0593b4 (some change)
      );
    }
  };

  const Login = async ({ email, password }) => {
    try {
      const res = await axios.post(
<<<<<<< HEAD
        `${api}/api/login`,
=======
        `${api}/api/auth/login`,
>>>>>>> b0593b4 (some change)
        { email, password },
        { withCredentials: true }
      );

      setUser(res.data.user);
      return res.data;

    } catch (error) {
      throw new Error(
<<<<<<< HEAD
        error.response?.data?.message || "Login failed"
=======
        error.response?.data?.message || "Login failed",
        { cause: error }
>>>>>>> b0593b4 (some change)
      );
    }
  };

  const Logout = async () => {
    await axios.post(
<<<<<<< HEAD
      `${api}/api/logout`,
=======
      `${api}/api/auth/logout`,
>>>>>>> b0593b4 (some change)
      {},
      { withCredentials: true }
    );

    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ User, Loading, fetchMe, Signup, Login, Logout }}
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