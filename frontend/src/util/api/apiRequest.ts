const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function apiRequest<T>(
    endpoint: string,
    method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
    body?: unknown,
    headers: HeadersInit = {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "credentials": "include"
    }
): Promise<T> {
    const response = await fetch(API_BASE_URL + endpoint, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    if (response.status === 204) return null as T;
    return response.json();
}
