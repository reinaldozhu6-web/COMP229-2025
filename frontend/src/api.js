// src/api.js
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

/**
 * 统一请求后端的小函数
 * 用法：
 *   apiRequest('/users')
 *   apiRequest('/users', { method: 'POST', body: {...} })
 */
export async function apiRequest(path, { method = "GET", body } = {}) {
    const options = {
        method,
        headers: { "Content-Type": "application/json" },
    };

    if (body) {
        options.body = JSON.stringify(body);
    }

    const res = await fetch(`${API_BASE_URL}${path}`, options);

    if (!res.ok) {
        const text = await res.text();
        throw new Error(`Request failed: ${res.status} ${text}`);
    }

    return res.json();
}
