import { getAccessToken } from "./tokenStore";
import { ApiError } from "./client";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

// Uploads (product/category images, product videos) need real progress —
// plain `fetch`, which the rest of the API client uses, has no upload
// progress event. XMLHttpRequest is the only browser API that exposes one,
// so file uploads get this small parallel client instead of `api.postForm`.
export function uploadFormData<T>(path: string, formData: FormData, onProgress?: (percent: number) => void): Promise<T> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", `${API_BASE_URL}${path}`);
    xhr.withCredentials = true;
    const token = getAccessToken();
    if (token) xhr.setRequestHeader("Authorization", `Bearer ${token}`);

    xhr.upload.onprogress = (e) => {
      if (onProgress && e.lengthComputable) onProgress(Math.round((e.loaded / e.total) * 100));
    };

    xhr.onload = () => {
      let body: unknown;
      try {
        body = xhr.responseText ? JSON.parse(xhr.responseText) : undefined;
      } catch {
        body = undefined;
      }
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(body as T);
      } else {
        const message = (body as { error?: { message?: string } } | undefined)?.error?.message ?? `Upload failed (${xhr.status})`;
        reject(new ApiError(message, xhr.status));
      }
    };
    xhr.onerror = () => reject(new ApiError("Network error during upload", 0));
    xhr.send(formData);
  });
}
