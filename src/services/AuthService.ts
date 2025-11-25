import { AxiosUtil } from "../utils/AxiosUtil";
import { findMockUser } from "../mocks/mockAuth";
import type { MockUserType } from "../mocks/mockAuth";
import type { UserInfoType } from "../types/user";

export type LoginResponse = {
    access_token: string;
    user: UserInfoType;
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
                        user:{
                            username: user.username,
                            name: user.name,
                            role: user.role
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