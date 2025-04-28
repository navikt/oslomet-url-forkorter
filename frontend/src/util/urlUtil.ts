const BASE_URL = import.meta.env.DEV ? "http://localhost:8080" : window.location.origin;

function escapeRegex(string: string): string {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function isValidHttpsUrl(input: string): boolean {
    try {
        const url = new URL(input);
        return url.protocol === "https:";
    } catch (_) {
        return false;
    }
}

export function isValidShortLink(input: string): boolean {
    const regex = new RegExp("[a-z0-9]{3,15}$");
    return regex.test(input);
}

export function isValidShortenedLink(input: string): boolean {
    const regex = new RegExp(`^${escapeRegex(BASE_URL)}/[a-z0-9]{3,15}$`);
    return regex.test(input);
}

export function extractShortUrl(input: string): string | null {
    const regex = new RegExp(`^${escapeRegex(BASE_URL)}/([a-z0-9]{6})$`);
    const match = input.match(regex);
    if (match) return match[1];
    return null;
}