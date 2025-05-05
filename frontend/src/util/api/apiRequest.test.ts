import { describe, it, expect, vi, beforeEach } from "vitest";
import { apiRequest } from "./apiRequest";

describe("apiRequest", () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });

    it("should return JSON data on successful GET", async () => {
        const mockData = { success: true };
        globalThis.fetch = vi.fn().mockResolvedValue({
            ok: true,
            status: 200,
            json: () => Promise.resolve(mockData),
        });

        const result = await apiRequest<{ success: boolean }>("test-endpoint");
        expect(fetch).toHaveBeenCalledWith(expect.stringContaining("test-endpoint"), expect.any(Object));
        expect(result).toEqual(mockData);
    });

    it("should throw an error on failed response", async () => {
        globalThis.fetch = vi.fn().mockResolvedValue({
            ok: false,
            status: 500,
            statusText: "Internal Server Error",
        });

        await expect(apiRequest("fail-endpoint")).rejects.toThrow("Error 500: Internal Server Error");
    });

    it("should return null on 204 No Content", async () => {
        globalThis.fetch = vi.fn().mockResolvedValue({
            ok: true,
            status: 204,
            json: () => Promise.resolve(), // won't be called
        });

        const result = await apiRequest("no-content");
        expect(result).toBeNull();
    });
});
