const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function apiRequest<T>(
    endpoint: string,
    method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
    body?: unknown,
    headers: HeadersInit = {
        "Content-Type": "application/json",
        "Accept": "application/json",
    }
): Promise<T> {
    const response = await fetch(API_BASE_URL + endpoint, {
        method,
        headers,
        credentials: "include",
        body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
        const error = new Error(`Error ${response.status}: ${response.statusText}`);
        (error as any).response = response.json();
        throw error;
    }

    if (response.status === 204) return null as T;
    return response.json();
}
