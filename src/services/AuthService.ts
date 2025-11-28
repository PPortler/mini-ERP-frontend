import { AxiosUtil } from "../utils/AxiosUtil";
import { findMockUser } from "../mocks/mockAuth";
import type { UserInfoType } from "../types/user";

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
            if (user) {
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
                        }
                    },
                };
            } else {
                return { ok: false, message: "Invalid credentials (mock)" };
            }
        }

        return AxiosUtil.createRequest<LoginResponse>({
            method: "POST",
            url: "/auth/login",
            data: {
                username: username,
                password: password,
            },
        });
    },
}