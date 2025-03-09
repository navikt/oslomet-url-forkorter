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
import Search from "../shared/Search/Search.tsx";

interface UrlData {
    id: number;
    shortUrl: string;
    longUrl: string;
    createdAt: string;
    createdBy: string | null;
    clicks: number;
}

type SortColumn = "createdAt" | "clicks" | null;

export default function ShowAllUrls() {
    const [urls, setUrls] = useState<UrlData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortConfig, setSortConfig] = useState<{ column: SortColumn, direction: "asc" | "desc" | null } | null>(null);

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

    function handleSort(column: SortColumn) {
        setSortConfig((prev) => {
            if (prev && prev.column === column) {
                return {
                    column,
                    direction: prev.direction === "desc" ? "asc" : prev.direction === "asc" ? null : "desc"
                };
            }
            return {column, direction: "desc"};
        });
    }

    let filteredUrls = urls.filter((url) =>
        url.longUrl.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (url.createdBy && url.createdBy.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    if (sortConfig?.direction) {
        filteredUrls = [...filteredUrls].sort((a, b) => {
            if (sortConfig.column === "createdAt") {
                return sortConfig.direction === "asc"
                    ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
                    : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            }
            if (sortConfig.column === "clicks") {
                return sortConfig.direction === "asc" ? a.clicks - b.clicks : b.clicks - a.clicks;
            }
            return 0;
        });
    } else {
        filteredUrls = [...filteredUrls].sort((a, b) => a.id - b.id);
    }

    return (
        <>
            <TableContainer>
                {loading && <p>Loading...</p>}
                {error && <p style={{color: "red"}}>{error}</p>}
                <Search
                    onChange={(text) => setSearchTerm(text)}
                    placeholder="Søk etter URL eller bruker.."
                    disableButton
                    style={{width: "100%"}}/>
                {!loading && !error && (
                    <StyledTable>
                        <TableHeader>
                            <TableRow>
                                <TableHeaderCell>ID</TableHeaderCell>
                                <TableHeaderCell>Kort URL</TableHeaderCell>
                                <TableHeaderCell>Lang URL</TableHeaderCell>
                                <TableHeaderCell>Av bruker</TableHeaderCell>
                                <TableHeaderCell onClick={() => handleSort("createdAt")} style={{cursor: "pointer"}}>
                                    <IconContainer style={{justifyContent: "space-between"}}>
                                        Opprettet
                                        {sortConfig?.column === "createdAt"
                                            ? sortConfig.direction === "asc"
                                                ? <Icon icon="sort-down"/>
                                                : sortConfig.direction === "desc"
                                                    ? <Icon icon="sort-up"/>
                                                    : <Icon icon="sort"/>
                                            : <Icon icon="sort"/>}
                                    </IconContainer>
                                </TableHeaderCell>
                                <TableHeaderCell onClick={() => handleSort("clicks")} style={{cursor: "pointer"}}>
                                    <IconContainer style={{justifyContent: "space-between"}}>
                                        Antall besøk
                                        {sortConfig?.column === "clicks"
                                            ? sortConfig.direction === "asc"
                                                ? <Icon icon="sort-down"/>
                                                : sortConfig.direction === "desc"
                                                    ? <Icon icon="sort-up"/>
                                                    : <Icon icon="sort"/>
                                            : <Icon icon="sort"/>}
                                    </IconContainer>
                                </TableHeaderCell>
                                <TableHeaderCell>Slett</TableHeaderCell>
                            </TableRow>
                        </TableHeader>
                        <tbody>
                        {filteredUrls.map((url) => (
                            <TableRow key={url.id}>
                                <TableCell>{url.id}</TableCell>
                                <TableCell>
                                    <IconContainer>
                                        <Icon icon="copy" onClick={() => {
                                            handleCopyClick(import.meta.env.VITE_BASE_URL + url.shortUrl)
                                        }}/>
                                        <StyledLink href={import.meta.env.VITE_BASE_URL + url.shortUrl}
                                                    target="_blank"
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
                                <TableCell>{url.createdBy || "Unknown"}</TableCell>
                                <TableCell>
                                    {new Intl.DateTimeFormat("nb-NO", {
                                        day: "2-digit",
                                        month: "long",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                        hour12: false
                                    }).format(new Date(url.createdAt)).replace(",", " kl.")}
                                </TableCell>
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
        </>
    );
}
