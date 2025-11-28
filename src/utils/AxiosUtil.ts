import axios from "axios";
import type { AxiosInstance, AxiosResponse } from "axios";

const baseAxios: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// type ของ request
type RequestParams = {
  method: "GET" | "POST" | "PUT" | "DELETE";
  url: string;
  data?: unknown;
  params?: Record<string, any>; 
};

// type ของ return
type RequestReturn<T> = Promise<{ ok: true; data: T } | { ok: false; message: string }>;

// function สำหรับเรียก API
async function createRequest<T>(params: RequestParams): RequestReturn<T> {
  try {
    let response: AxiosResponse<T>;
  if (params.method === "GET") {
      response = await baseAxios.get<T>(params.url, { params: params.params }); 
      response = await baseAxios.post<T>(params.url, params.data, { params: params.params });
    } else if (params.method === "PUT") {
      response = await baseAxios.put<T>(params.url, params.data, { params: params.params });
    } else if (params.method === "DELETE") {
      response = await baseAxios.delete<T>(params.url, { params: params.params });
    } else {
      throw new Error("Invalid method");
    }

    return { ok: true, data: response.data };
  } catch (error: unknown) {
    let message = "Unknown error";
    if (error instanceof Error) {
      message = error.message;
    } else if (typeof error === "object" && error !== null && "message" in error) {
      message = String((error as { message: unknown }).message);
    }

    return { ok: false, message };
  }
}

// export object แบบเดียวกับตัวอย่าง
export const AxiosUtil = {
  createRequest,
};