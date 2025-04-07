const ACCEPTED_DOMAINS = [
    "https://bachelor-url-forkorter.sandbox.test-nais.cloud.nais.io",
    "https://url-forkorter.nav.no",
    "http://localhost:8080"
];

export function isValidUrl(input: string): boolean {
    const regex = /^(https:\/\/)?(www\.)?[a-zA-Z0-9-]+(\.[a-zA-Z]{2,})+\/?$/;
    return regex.test(input);
}

export function isValidShortenedLink(input: string): boolean {
    return ACCEPTED_DOMAINS.some(domain => {
        const regex = new RegExp(`^${domain}/[a-z0-9]{6}$`);
        return regex.test(input);
    });
}

export function extractShortUrl(input: string): string | null {
    for (const domain of ACCEPTED_DOMAINS) {
        const regex = new RegExp(`^${domain}/([a-z0-9]{6})$`);
        const match = input.match(regex);
        if (match) return match[1];
    }
    return null;
}