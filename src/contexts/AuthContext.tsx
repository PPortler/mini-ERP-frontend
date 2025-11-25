// contexts/AuthContext.tsx
import { createContext, useState, useEffect, useContext } from "react";
import type { ReactNode } from "react";
import Cookies from "js-cookie";

type AuthContextType = {
    accessToken: string | null;
    role: number | null;
    setAuth: (token: string, role: number) => void;
    logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [role, setRole] = useState<number | null>(null);

    useEffect(() => {
        const token = Cookies.get("access_token") || null;
        const roleCookie = Cookies.get("role") ? Number(Cookies.get("role")) : null;
        setTimeout(() => {
            setAccessToken(token);
            setRole(roleCookie);
        }, 0)
    }, []);

    const setAuth = (token: string, role: number) => {
        localStorage.setItem("access_token", token);
        Cookies.set("access_token", token, { expires: 1 });
        Cookies.set("role", role.toString(), { expires: 1 });
        setAccessToken(token);
        setRole(role);
    };

    const logout = () => {
        Cookies.remove("access_token");
        Cookies.remove("role");
        setAccessToken(null);
        setRole(null);
    };

    return (
        <AuthContext.Provider value={{ accessToken, role, setAuth, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

AuthProvider.useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};