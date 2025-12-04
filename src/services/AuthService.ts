import { AxiosUtil } from "../utils/AxiosUtil";
import { findMockUser } from "../mocks/mockAuth";
import type { UserInfoType } from "../types/user";

export type RefreshResponse = {
    access_token: string;
    refresh_token?: string;
    user?: UserInfoType;
};

export type RefreshResult =
    | { ok: true; data: RefreshResponse }
    | { ok: false; message: string };

export type LoginResponse = {
    user: UserInfoType;
};

export type LoginResult =
    | { ok: true; data: LoginResponse }
    | { ok: false; message: string };

export const AuthService = {
    async login(username: string, password: string): Promise<LoginResult> {
        if (import.meta.env.VITE_USE_MOCK === "true") {
            const user: UserInfoType | undefined = findMockUser(username, password);
            if (!user) {
                return { ok: false, message: "Invalid credentials (mock)" };
            }

            return {
                ok: true,
                data: {
                    user: {
                        user_id: user.user_id,
                        username: user.username,
                        first_name: user.first_name,
                        last_name: user.last_name,
                        role: user.role,
                        access_token: `mock_access_${user.username}`,
                        refresh_token: `mock_refresh_${user.username}`,
                        access_token_exp: 17990,
                        refresh_token_exp: 17990,
                    },
                },
            };
        }

        const payload = {
            username: username,
            password: password
        }
        try {
            const res = await AxiosUtil.createRequest<UserInfoType>({
                method: "POST",
                url: "/auth/login",
                data: payload,
            });

            if (!res.ok) return { ok: false, message: res.message };

            return {
                ok: true, data: {
                    user: res.data
                }
            };

        } catch (err: unknown) {
            let message = "Unknown error";
            if (err instanceof Error) message = err.message;
            return { ok: false, message };
        }
    },

    // async refreshToken(refreshToken: string): Promise<RefreshResult> {
    //     try {
    //         if (import.meta.env.VITE_USE_MOCK === "true") {
    //             if (refreshToken.startsWith("mock_refresh_")) {
    //                 return {
    //                     ok: true,
    //                     data: {
    //                         access_token: `mock_access_refreshed_${Date.now()}`,
    //                         refresh_token: refreshToken,
    //                     },
    //                 };
    //             }

    //             return { ok: false, message: "Refresh token invalid (mock)" };
    //         }

    //         const result = await AxiosUtil.createRequest<RefreshResponse>({
    //             method: "POST",
    //             url: "/auth/refresh",
    //             data: { refresh_token: refreshToken },
    //         });

    //         if (!result.ok) {
    //             return {
    //                 ok: false,
    //                 message: result.message,
    //             };
    //         }

    //         return {
    //             ok: true,
    //             data: result.data,
    //         };

    //     } catch (error) {
    //         console.error("refreshToken failed:", error);
    //         let message = "Something went wrong while refreshing token";
    //         if (error instanceof Error) {
    //             message = error.message;
    //         }
    //         return {
    //             ok: false,
    //             message: message,
    //         };
    //     }
    // },
}