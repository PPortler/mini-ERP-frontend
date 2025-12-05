import { atom } from "nanostores";
import type { UserInfoType } from "../types/user";

export const $authUser = atom<UserInfoType | null | undefined>(undefined);

export const authActions = {
    setAuth: (
        access_token: string,
        user: UserInfoType,
    ) => {
        localStorage.setItem("access_token", access_token);
        localStorage.setItem(
            "userInfo",
            JSON.stringify({
                user_id: user.id,
                first_name: user.first_name,
                last_name: user.last_name,
                role: user.role,
                username: user.username
            })
        );
        $authUser.set({
            ...user,
            access_token,
        });
    },
    logout: () => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("userInfo");
        $authUser.set(null);
    },
    initializeAuth: () => {
        const access_token = localStorage.getItem("access_token") || undefined;
        const userInfoRaw = localStorage.getItem("userInfo");
        if (userInfoRaw) {
            try {
                const userInfo = JSON.parse(userInfoRaw);
                $authUser.set({
                    ...userInfo,
                    access_token,
                });
            } catch (err) {
                console.error("Failed to parse userInfo from localStorage:", err);
                $authUser.set(null);
            }
        } else {
            $authUser.set(null);
        }
    }
}