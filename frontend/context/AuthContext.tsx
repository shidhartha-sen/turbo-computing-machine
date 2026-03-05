import * as SecureStore from 'expo-secure-store';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { api, setAuthToken } from '../services/api';

const TOKEN_KEY = 'access_token';

type User = { id: string; name: string; email: string };

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const token = await SecureStore.getItemAsync(TOKEN_KEY);
      if (token) {
        setAuthToken(token);
        try {
          const me = await api.getMe();
          setUser({ id: me.user_id, name: me.name, email: me.email });
        } catch {
          await SecureStore.deleteItemAsync(TOKEN_KEY);
          setAuthToken(null);
        }
      }
      setIsLoading(false);
    })();
  }, []);

  async function login(email: string, password: string) {
    const res = await api.login(email, password);
    await SecureStore.setItemAsync(TOKEN_KEY, res.access_token);
    setAuthToken(res.access_token);
    setUser({ id: res.user_id, name: res.name, email: res.email });
  }

  async function register(name: string, email: string, password: string) {
    const res = await api.register(name, email, password);
    await SecureStore.setItemAsync(TOKEN_KEY, res.access_token);
    setAuthToken(res.access_token);
    setUser({ id: res.user_id, name: res.name, email: res.email });
  }

  async function logout() {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    setAuthToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
