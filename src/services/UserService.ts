import { AxiosUtil } from "../utils/AxiosUtil";
import { mockUsers } from "../mocks/mockAuth";
import type { UserInfoType } from "../types/user";
import type { UserResponse } from "../types/apiResponse";


export type UserServiceResult =
    | { ok: true; data?: UserInfoType[]; message?: string }
    | { ok: false; message: string };

export const UserService = {
    async getAll(): Promise<UserServiceResult> {

        if (import.meta.env.VITE_USE_MOCK === "true") {
            return { ok: true, data: mockUsers };
        }

        try {
            const res = await AxiosUtil.createRequest<UserResponse>({
                method: "GET",
                url: "/user",
            });

            if (!res.ok) return { ok: false, message: res.message };

            const list = Array.isArray(res.data.users) ? res.data.users : [];

            return { ok: true, data: list };
        } catch (err: unknown) {
            let message = "เกิดข้อผิดพลาดในการโหลดข้อมูล";
            if (err instanceof Error) {
                message = err.message;
            }
            return { ok: false, message };
        }
    },

    // เพิ่ม User
    async create(
        users: UserInfoType
    ): Promise<UserServiceResult> {
        if (import.meta.env.VITE_USE_MOCK === "true") {
            const newItems = {
                ...users,
                user_id: crypto.randomUUID(),
                create_at: new Date().toISOString(),
            };
            mockUsers.push(newItems);
            return { ok: true };
        }

        try {
            const payload = {
                username: users.username,
                password: users.password,
                first_name: users.first_name,
                last_name: users.last_name,
                role: users.role
            }
            const res = await AxiosUtil.createRequest<UserResponse>({
                method: "POST",
                url: "/user",
                data: payload,
            });

            if (!res.ok) return { ok: false, message: res.message };

            return { ok: true };

        } catch (err: unknown) {
            let message = "เกิดข้อผิดพลาดในการโหลดข้อมูล";
            if (err instanceof Error) {
                message = err.message;
            }
            return { ok: false, message };
        }
    },

    // อัปเดต Users
    async update(
        user_id: string,
        users: Partial<UserInfoType>
    ): Promise<UserServiceResult> {
        if (import.meta.env.VITE_USE_MOCK === "true") {
            const idx = mockUsers.findIndex(item => item.user_id === user_id);
            if (idx === -1)
                return { ok: false, message: "Supplier not found (mock)" };

            mockUsers[idx] = { ...mockUsers[idx], ...users };
            return { ok: true, data: [mockUsers[idx]] };
        }

        try {
            const payload = {
                // user_id: users.user_id,
                username: users.username,
                password: users.password,
                first_name: users.first_name,
                last_name: users.last_name,
                role: users.role
            }
            const res = await AxiosUtil.createRequest<UserResponse>({
                method: "PUT",
                url: `/user/${user_id}`,
                data: payload,
            });

            if (!res.ok) return { ok: false, message: res.message };

            return { ok: true };
        } catch (err: unknown) {
            let message = "เกิดข้อผิดพลาดในการโหลดข้อมูล";
            if (err instanceof Error) {
                message = err.message;
            }
            return { ok: false, message };
        }
    },

    //delete User
    async delete(user_id: string): Promise<UserServiceResult> {
        if (import.meta.env.VITE_USE_MOCK === "true") {
            const idx = mockUsers.findIndex(item => item.user_id === user_id);
            if (idx === -1)
                return { ok: false, message: "Supplier not found (mock)" };

            const deleted = mockUsers.splice(idx, 1);
            return { ok: true, data: deleted };
        }

        try {
            const res = await AxiosUtil.createRequest<UserResponse>({
                method: "DELETE",
                url: `/user/${user_id}`,
            });

            if (!res.ok) return { ok: false, message: res.message };
            return { ok: true };
        } catch (err: unknown) {
            let message = "เกิดข้อผิดพลาดในการโหลดข้อมูล";
            if (err instanceof Error) {
                message = err.message;
            }
            return { ok: false, message };
        }
    },

}