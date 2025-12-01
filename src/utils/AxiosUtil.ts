import axios from "axios";
import type { AxiosInstance, AxiosResponse } from "axios";

const baseAxios: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  // withCredentials: true,
});

baseAxios.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// type ของ request
type RequestParams = {
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
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
    } else if (params.method === "POST") {
      response = await baseAxios.post<T>(params.url, params.data, { params: params.params });
    } else if (params.method === "PUT") {
      response = await baseAxios.put<T>(params.url, params.data, { params: params.params });
    } else if (params.method === "DELETE") {
      response = await baseAxios.delete<T>(params.url, { params: params.params });
    } else if (params.method === "PATCH") {
      response = await baseAxios.patch<T>(params.url, params.data, { params: params.params });
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

// let isRefreshing = false;
// let queue: Array<() => void> = [];

// baseAxios.interceptors.request.use(async (config) => {
//   const user = $authUser.get();
//   const now = Math.floor(Date.now() / 1000);

//   if (user) {
//     if (user.access_token_exp && user.access_token_exp <= now) {
//       const refreshTokenValid = user.refresh_token_exp && user.refresh_token_exp > now;

//       if (refreshTokenValid && !isRefreshing) {
//         try {
//           isRefreshing = true;
//           const res = await axios.post(
//             import.meta.env.VITE_APP_BASE_API_URL + "/auth/refresh-token",
//             { refresh_token: user.refresh_token }
//           );

//           const { access_token, access_token_exp, refresh_token, refresh_token_exp } = res.data;

//           localStorage.setItem("access_token", access_token);
//           localStorage.setItem("access_token_exp", access_token_exp.toString());
//           localStorage.setItem("refresh_token", refresh_token);
//           localStorage.setItem("refresh_token_exp", refresh_token_exp.toString());

//           const updatedUser = {
//             ...user,
//             access_token,
//             access_token_exp,
//             refresh_token,
//             refresh_token_exp
//           };
//           $authUser.set(updatedUser);

//           config.headers.Authorization = `Bearer ${access_token}`;

//           // ยิงคิว
//           queue.forEach((cb) => cb());
//           queue = [];
//         } catch (err) {
//           $authUser.set(null);
//           return Promise.reject(err);
//         } finally {
//           isRefreshing = false;
//         }
//       } else if (!refreshTokenValid) {
//         // refresh หมดอายุ → logout
//         ["access_token", "refresh_token", "access_token_exp", "refresh_token_exp", "userInfo"].forEach((key) =>
//           localStorage.removeItem(key)
//         );
//         $authUser.set(null);
//         return Promise.reject(new Error("Session expired. Please login again."));
//       } else if (isRefreshing) {
//         // ดักคิว
//         return new Promise((resolve) => {
//           queue.push(() => resolve(baseAxios(config)));
//         });
//       }
//     } else {
//       // access token ยังไม่หมด
//       config.headers.Authorization = `Bearer ${user.access_token}`;
//     }
//   }

//   return config;
// });

export const AxiosUtil = {
  createRequest,
};