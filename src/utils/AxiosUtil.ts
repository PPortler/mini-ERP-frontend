import axios from "axios";
import type { AxiosInstance, AxiosResponse } from "axios";
import { $authUser } from "../stores/authUserStore";

const baseAxios: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

baseAxios.interceptors.request.use((config) => {
  const token = $authUser.get()?.access_token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// type ของ request
type RequestParams = {
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  url: string;
  data?: unknown;
  params?: Record<string, unknown>;
  responseType?: "json" | "blob" | "arraybuffer" | "text";
};

// type ของ return
type RequestReturn<T> = Promise<{ ok: true; data: T } | { ok: false; message: string }>;

// function สำหรับเรียก API
async function createRequest<T>(params: RequestParams): RequestReturn<T> {
  try {
    let response: AxiosResponse<T>;
    const axiosConfig = {
      params: params.params,
      responseType: params.responseType || "json",
    };
    if (params.method === "GET") {
      response = await baseAxios.get<T>(params.url, axiosConfig);
    } else if (params.method === "POST") {
      response = await baseAxios.post<T>(params.url, params.data, axiosConfig);
    } else if (params.method === "PUT") {
      response = await baseAxios.put<T>(params.url, params.data, axiosConfig);
    } else if (params.method === "DELETE") {
      response = await baseAxios.delete<T>(params.url, axiosConfig);
    } else if (params.method === "PATCH") {
      response = await baseAxios.patch<T>(params.url, params.data, axiosConfig);
    } else {
      throw new Error("Invalid method");
    }

    return { ok: true, data: response.data };
  } catch (error: unknown) {
    let message = "Unknown error";
    if (error instanceof Error) {
      message = error.message;
    }

    return { ok: false, message };
  }
}

if (import.meta.env.VITE_USE_MOCK !== 'true') {

  let isRefreshing = false;

  interface FailedQueueItem {
    resolve: (token: string) => void;
    reject: (error: unknown) => void;
  }

  let failedQueue: FailedQueueItem[] = [];

  const processQueue = (error: unknown, token: string | null = null) => {
    failedQueue.forEach((prom) => {
      if (error) {
        prom.reject(error);
      } else if (token) {
        prom.resolve(token);
      }
    });

    failedQueue = [];
  };

  baseAxios.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      // ถ้าไม่ใช่ 401 หรือ retry แล้ว → ไป error เลย
      if (error.response?.status !== 401 || originalRequest._retry) {
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      // ถ้ากำลัง refresh อยู่ → รอ queue
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          const queueItem: FailedQueueItem = {
            resolve: (token: string) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              resolve(baseAxios(originalRequest));
            },
            reject,
          };
          failedQueue.push(queueItem);
        });
      }

      isRefreshing = true;

      try {
        // ยิง refresh token API
        const refreshRes = await axios.post(
          import.meta.env.VITE_APP_BASE_API_URL + "/auth/token/refresh",
          {},
          { withCredentials: true }
        );

        const newAccessToken = refreshRes.data.access_token;

        // เก็บ token ใหม่
        localStorage.setItem("access_token", newAccessToken);

        // อัปเดต store
        const user = $authUser.get();
        if (user) {
          $authUser.set({ ...user, access_token: newAccessToken });
        }
        processQueue(null, newAccessToken);

        // เพิ่ม token ใหม่ใน header แล้วยิงใหม่
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        return baseAxios(originalRequest);
      } catch (refreshErr) {
        processQueue(refreshErr, null);

        // refresh fail → logout
        localStorage.removeItem("access_token");
        localStorage.removeItem("userInfo");
        $authUser.set(null);

        return Promise.reject(refreshErr);
      } finally {
        isRefreshing = false;
      }
    }
  );
}

export const AxiosUtil = {
  createRequest,
};