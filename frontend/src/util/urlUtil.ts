const BASE_URL = window.location.origin;

function escapeRegex(string: string): string {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function isValidUrl(input: string): boolean {
    const regex = /^(https:\/\/)?(www\.)?[a-zA-Z0-9-]+(\.[a-zA-Z]{2,})+\/?$/;
    return regex.test(input);
}

export function isValidShortenedLink(input: string): boolean {
    const regex = new RegExp(`^${escapeRegex(BASE_URL)}/[a-z0-9]{6}$`);
    return regex.test(input);
}

export function extractShortUrl(input: string): string | null {
    const regex = new RegExp(`^${escapeRegex(BASE_URL)}/([a-z0-9]{6})$`);
    const match = input.match(regex);
    if (match) return match[1];
    return null;
}
