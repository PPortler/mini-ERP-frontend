import { createContext, useEffect, useContext } from "react";
import type { ReactNode } from "react";
import type { UserInfoType } from "../types/user";
import { $authUser } from "../stores/authUserStore";

type AuthContextType = {
      setAuth: (
        access_token: string,
        access_token_exp: number,
        refresh_token: string,
        refresh_token_exp: number,
        user: UserInfoType
    ) => void;
    logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {

    useEffect(() => {
        const access_token = localStorage.getItem("access_token") || undefined;
        const access_token_exp = localStorage.getItem("access_token_exp") ? Number(localStorage.getItem("access_token_exp")) : undefined;
        const refresh_token = localStorage.getItem("refresh_token") || undefined;
        const refresh_token_exp = localStorage.getItem("refresh_token_exp") ? Number(localStorage.getItem("refresh_token_exp")) : undefined;
        const userInfoRaw = localStorage.getItem("userInfo");

        if (userInfoRaw) {
            try {
                const userInfo = JSON.parse(userInfoRaw);
                $authUser.set({
                    ...userInfo,
                    access_token,
                    access_token_exp,
                    refresh_token,
                    refresh_token_exp,
                });
            } catch (err) {
                console.error("Failed to parse userInfo from localStorage:", err);
                $authUser.set(null);
            }
        } else {
            $authUser.set(null);
        }
    }, []);

    const setAuth = (
        access_token: string,
        access_token_exp: number,
        refresh_token: string,
        refresh_token_exp: number,
        user: UserInfoType
    ) => {
        localStorage.setItem("access_token", access_token);
        localStorage.setItem("access_token_exp", access_token_exp.toString());
        localStorage.setItem("refresh_token", refresh_token);
        localStorage.setItem("refresh_token_exp", refresh_token_exp.toString());
        localStorage.setItem(
            "userInfo",
            JSON.stringify({
                user_id: user.user_id,
                first_name: user.first_name,
                last_name: user.last_name,
                role: user.role,
                username: user.username
            })
        );
        $authUser.set({
            ...user,
            access_token,
            access_token_exp,
            refresh_token,
            refresh_token_exp,
        });
    };

    const logout = () => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("access_token_exp");
        localStorage.removeItem("refresh_token_exp");
        localStorage.removeItem("userInfo");
        $authUser.set(null);
    };

    return (
        <AuthContext.Provider value={{ setAuth, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

AuthProvider.useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within AuthProvider");
    return ctx;
};