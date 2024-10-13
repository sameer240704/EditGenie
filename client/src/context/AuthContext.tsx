import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";

interface User {
  name: string;
  email: string;
  avatar: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (
    name: string,
    email: string,
    password: string,
    avatar: File
  ) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const serverUrl = import.meta.env.VITE_SERVER_URL;

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const register = async (
    name: string,
    email: string,
    password: string,
    avatar: File
  ) => {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("avatar", avatar);

    try {
      const response = await axios.post(
        `${serverUrl}/auth/register`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setUser(response.data.user);
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post(`${serverUrl}/auth/login`, {
        email,
        password,
      });
      setUser(response.data.user);
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await axios.post(`${serverUrl}/auth/logout`);
      setUser(null);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const checkAuth = async () => {
    try {
      const response = await axios.post(`${serverUrl}/auth/checkAuth`);
      setUser(response.data.user);
    } catch (error) {
      console.error("Authentication check error:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, login, register, logout, checkAuth, loading }}
    >
      {loading ? <div>Loading...</div> : children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export { AuthProvider, useAuth };
