import { getAccessToken, setAccessToken, notifySessionExpired } from "./tokenStore";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

export class ApiError extends Error {
  status: number;
  details?: unknown;

  constructor(message: string, status: number, details?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

interface RequestOptions extends RequestInit {
  /** Internal — prevents infinite refresh loops on the retried request. */
  skipAuthRetry?: boolean;
}

let refreshPromise: Promise<boolean> | null = null;

async function refreshAccessToken(): Promise<boolean> {
  if (!refreshPromise) {
    refreshPromise = fetch(`${API_BASE_URL}/auth/refresh`, { method: "POST", credentials: "include" })
      .then(async (res) => {
        if (!res.ok) return false;
        const data = await res.json();
        setAccessToken(data.accessToken);
        return true;
      })
      .catch(() => false)
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
}

async function parseErrorBody(res: Response): Promise<{ message: string; details?: unknown }> {
  try {
    const body = await res.json();
    return { message: body?.error?.message ?? `Request failed (${res.status})`, details: body?.error?.details };
  } catch {
    return { message: `Request failed (${res.status})` };
  }
}

export async function apiFetch<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const token = getAccessToken();
  const isFormData = options.body instanceof FormData;

  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (res.status === 401 && !options.skipAuthRetry && !path.startsWith("/auth/")) {
    const refreshed = await refreshAccessToken();
    if (refreshed) {
      return apiFetch<T>(path, { ...options, skipAuthRetry: true });
    }
    notifySessionExpired();
  }

  if (!res.ok) {
    const { message, details } = await parseErrorBody(res);
    throw new ApiError(message, res.status, details);
  }

  if (res.status === 204) return undefined as T;

  const contentType = res.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    return (await res.json()) as T;
  }
  return undefined as T;
}

/** For file downloads (PDF invoices, CSV exports) that need the Authorization
 * header — a plain `<a href>` can't carry it, so callers fetch a blob instead. */
export async function apiFetchBlob(path: string, options: RequestOptions = {}): Promise<Blob> {
  const token = getAccessToken();
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    credentials: "include",
    headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}), ...options.headers },
  });

  if (res.status === 401 && !options.skipAuthRetry) {
    const refreshed = await refreshAccessToken();
    if (refreshed) return apiFetchBlob(path, { ...options, skipAuthRetry: true });
    notifySessionExpired();
  }

  if (!res.ok) {
    const { message } = await parseErrorBody(res);
    throw new ApiError(message, res.status);
  }
  return res.blob();
}

export function buildQuery<T extends Record<string, string | number | boolean | undefined | null>>(params: T): string {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== "") search.set(key, String(value));
  }
  const qs = search.toString();
  return qs ? `?${qs}` : "";
}

export const api = {
  get: <T>(path: string, options?: RequestOptions) => apiFetch<T>(path, { ...options, method: "GET" }),
  post: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    apiFetch<T>(path, { ...options, method: "POST", body: body !== undefined ? JSON.stringify(body) : undefined }),
  postForm: <T>(path: string, formData: FormData, options?: RequestOptions) =>
    apiFetch<T>(path, { ...options, method: "POST", body: formData }),
  patch: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    apiFetch<T>(path, { ...options, method: "PATCH", body: body !== undefined ? JSON.stringify(body) : undefined }),
  put: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    apiFetch<T>(path, { ...options, method: "PUT", body: body !== undefined ? JSON.stringify(body) : undefined }),
  delete: <T>(path: string, options?: RequestOptions) => apiFetch<T>(path, { ...options, method: "DELETE" }),
};
