import { AxiosUtil } from "../utils/AxiosUtil";
import { findMockUser } from "../mocks/mockAuth";
import type { MockUserType } from "../mocks/mockAuth";

export type LoginResponse = {
    access_token: string;
    role: number;
};

export type LoginResult =
    | { ok: true; data: LoginResponse }
    | { ok: false; message: string };

export const AuthService = {
    async login(username: string, password: string): Promise<LoginResult> {
        if (import.meta.env.VITE_USE_MOCK === "true") {
            const user: MockUserType | undefined = findMockUser(username, password);
            if (user) {
                return {
                    ok: true,
                    data: {
                        access_token: `mock_token_${user.username}_123456`,
                        role: user.role,
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
                email: username,
                password,
            },
        });
    },
}