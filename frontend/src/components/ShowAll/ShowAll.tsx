import {useEffect, useState} from "react";
import {apiRequest} from "../../util/api/apiRequest.ts";
import {
    IconContainer,
    StyledLink,
    StyledTable,
    TableCell,
    TableContainer,
    TableHeader,
    TableHeaderCell,
    TableRow
} from "./showall.style.ts";
import Icon from "../shared/Icon/Icon.tsx";

interface UrlData {
    id: number;
    shortUrl: string;
    longUrl: string;
    createdAt: string;
    createdBy: string | null;
    clicks: number;
}

export default function ShowAllUrls() {
    const [urls, setUrls] = useState<UrlData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchUrls() {
            try {
                const data = await apiRequest<UrlData[]>("hentalle");
                setUrls(data);
            } catch (err) {
                setError("Failed to fetch URLs");
                console.error("API error:", err);
            }
        }

        fetchUrls().then(() => setLoading(false));
    }, []);

    function handleDeleteClick(id: number) {
        apiRequest<{ forkortetUrl: string }>(`slett?id=${id}`, "POST")
            .then(() => setUrls((prevUrls) => prevUrls.filter((url) => url.id !== id)))
            .catch((error: Error) => {
                console.error("API error:", error);
            });
    }

    function handleCopyClick(url: string) {
        navigator.clipboard.writeText(url).then(() => {

        });
    }

    return (
        <TableContainer>
            {loading && <p>Loading...</p>}
            {error && <p style={{color: "red"}}>{error}</p>}

            {!loading && !error && (
                <StyledTable>
                    <TableHeader>
                        <TableRow>
                            <TableHeaderCell>ID</TableHeaderCell>
                            <TableHeaderCell>Kort URL</TableHeaderCell>
                            <TableHeaderCell>Lang URL</TableHeaderCell>
                            <TableHeaderCell>Opprettet</TableHeaderCell>
                            <TableHeaderCell>Av bruker</TableHeaderCell>
                            <TableHeaderCell>Antall besøk</TableHeaderCell>
                            <TableHeaderCell>Slett</TableHeaderCell>
                        </TableRow>
                    </TableHeader>
                    <tbody>
                    {urls.map((url) => (
                        <TableRow key={url.id}>
                            <TableCell>{url.id}</TableCell>
                            <TableCell>
                                <IconContainer>
                                    <Icon icon="copy" onClick={() => {
                                        handleCopyClick(import.meta.env.VITE_BASE_URL + url.shortUrl)
                                    }}/>
                                    <StyledLink href={import.meta.env.VITE_BASE_URL + url.shortUrl} target="_blank"
                                                rel="noopener noreferrer">
                                        {url.shortUrl}
                                    </StyledLink>

                                </IconContainer>
                            </TableCell>
                            <TableCell>
                                <StyledLink href={url.longUrl} target="_blank" rel="noopener noreferrer">
                                    {url.longUrl}
                                </StyledLink>
                            </TableCell>
                            <TableCell>{new Date(url.createdAt).toLocaleString()}</TableCell>
                            <TableCell>{url.createdBy || "Unknown"}</TableCell>
                            <TableCell>{url.clicks}</TableCell>
                            <TableCell><Icon icon="close" onClick={() => {
                                handleDeleteClick(url.id)
                            }}></Icon></TableCell>
                        </TableRow>
                    ))}
                    </tbody>
                </StyledTable>
            )}
        </TableContainer>
    );
}
