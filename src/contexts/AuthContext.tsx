import { createContext, useState, useEffect, useContext } from "react";
import type { ReactNode } from "react";
import Cookies from "js-cookie";
import type { UserInfoType } from "../types/user";
import { LoadingProvider } from "./LoadingContext";

type AuthContextType = {
    accessToken: string | null;
    user: UserInfoType | null;
    setAuth: (token: string, user: UserInfoType) => void;
    logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [user, setUser] = useState<UserInfoType | null>(null);

    useEffect(() => {
        const token = Cookies.get("access_token") || null;
        const storedUser = Cookies.get("user") ? JSON.parse(Cookies.get("user")!) : null;
        setTimeout(() => {
            setAccessToken(token);
            setUser(storedUser);
        }, 0)
    }, []);

    const setAuth = (token: string, user: UserInfoType) => {
        localStorage.setItem("access_token", token);
        Cookies.set("access_token", token, { expires: 1 });
        Cookies.set("user", JSON.stringify(user), { expires: 1 });
        setAccessToken(token);
        setUser(user);
    };

    const logout = () => {
        Cookies.remove("access_token");
        Cookies.remove("user");
        setAccessToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ accessToken, user, setAuth, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

AuthProvider.useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within AuthProvider");
    return ctx;
};