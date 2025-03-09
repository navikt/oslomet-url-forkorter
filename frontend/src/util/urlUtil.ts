export function isValidUrl(input: string): boolean {
    const regex = /^(https:\/\/)?(www\.)?[a-zA-Z0-9-]+(\.[a-zA-Z]{2,})+$/;
    return regex.test(input);
}


export function extractShortUrl(input: string, baseUrl: string = "t.est"): string | null {
    const regex = new RegExp(`^(https?://)?(www\\.)?${baseUrl}/`);
    const shortUrl = input.replace(regex, "").trim();

    return shortUrl.length == 6 ? shortUrl : null;
}