import axios from 'axios';
import { createContext, useContext, useEffect, useState } from 'react';

const api = "http://localhost:3000";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [User, setUser] = useState(null);
  const [Loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMe();
  }, []);

  const fetchMe = async () => {
    try {
      const res = await axios.get(`${api}/api/getme`, {
        withCredentials: true
      });
      setUser(res.data.user); // 
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const Signup = async ({ name, email, password }) => {
    try {
      const res = await axios.post(
        `${api}/api/auth/signup`,
        { name, email, password },
        { withCredentials: true }
      );

      setUser(res.data.user);
      return res.data;

    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Signup failed"
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

      setUser(res.data.user);
      return res.data;

    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Login failed"
      );
    }
  };

  const Logout = async () => {
    await axios.post(
      `${api}/api/auth/logout`,
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