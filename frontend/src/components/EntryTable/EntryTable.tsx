import {useEffect, useState} from "react";
import {apiRequest} from "../../util/api/apiRequest.ts";
import Icon from "../shared/Icon/Icon.tsx";
import Search from "../shared/Search/Search.tsx";
import Link from "../shared/Link/Link.tsx";
import classes from "./entrytable.module.css"

interface UrlData {
    id: number;
    shortUrl: string;
    longUrl: string;
    createdAt: string;
    createdBy: string | null;
    clicks: number;
}

type SortColumn = "createdAt" | "clicks" | null;

export default function EntryTable() {
    const [urls, setUrls] = useState<UrlData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortConfig, setSortConfig] = useState<{ column: SortColumn, direction: "asc" | "desc" | null } | null>(null);

    useEffect(() => {
        async function fetchUrls() {
            try {
                const data = await apiRequest<UrlData[]>("url/hentalle", true);
                setUrls(data);
            } catch (err) {
                setError("Feil ved henting av liste over URLer");
                console.error("API error:", err);
            }
        }

        fetchUrls().then(() => setLoading(false));
    }, []);

    function handleDeleteClick(id: number) {
        apiRequest<{ forkortetUrl: string }>(`url/slett?id=${id}`, true, "POST")
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

    const BASE_URL = import.meta.env.DEV ? "http://localhost:8080/" : window.location.origin + "/";

    return (
        <>
            <section className={classes.container}>
                {loading && <p>Loading...</p>}
                {error && <p style={{color: "red"}}>{error}</p>}
                <Search
                    onChange={(text) => setSearchTerm(text)}
                    placeholder="Søk etter URL eller bruker.."
                    disableButton
                    style={{width: "100%"}}/>
                {!loading && !error && (
                    <table className={classes.table}>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Kort URL</th>
                                <th>Lang URL</th>
                                <th>Av bruker</th>
                                <th onClick={() => handleSort("createdAt")} style={{cursor: "pointer"}}>
                                    <div className={classes.icon}>
                                        Opprettet
                                        {sortConfig?.column === "createdAt"
                                            ? sortConfig.direction === "asc"
                                                ? <Icon icon="sort-down"/>
                                                : sortConfig.direction === "desc"
                                                    ? <Icon icon="sort-up"/>
                                                    : <Icon icon="sort"/>
                                            : <Icon icon="sort"/>}
                                    </div>
                                </th>
                                <th onClick={() => handleSort("clicks")} style={{cursor: "pointer"}}>
                                    <div className={classes.icon}>
                                        Antall besøk
                                        {sortConfig?.column === "clicks"
                                            ? sortConfig.direction === "asc"
                                                ? <Icon icon="sort-down"/>
                                                : sortConfig.direction === "desc"
                                                    ? <Icon icon="sort-up"/>
                                                    : <Icon icon="sort"/>
                                            : <Icon icon="sort"/>}
                                    </div>
                                </th>
                                <th>Slett</th>
                            </tr>
                        </thead>
                        <tbody>
                        {filteredUrls.map((entry) => (
                            <tr key={entry.id}>
                                <td>{entry.id}</td>
                                <td>
                                    <div className={classes.icon}>
                                        <Icon icon="copy" onClick={() => {
                                            handleCopyClick(BASE_URL + entry.shortUrl)
                                        }}/>
                                        <Link href={BASE_URL + entry.shortUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer">
                                            {entry.shortUrl}
                                        </Link>
                                    </div>
                                </td>
                                <td>
                                    <Link href={entry.longUrl} target="_blank" rel="noopener noreferrer">
                                        {entry.longUrl}
                                    </Link>
                                </td>
                                <td>{entry.createdBy || "Unknown"}</td>
                                <td>
                                    {new Intl.DateTimeFormat("nb-NO", {
                                        day: "2-digit",
                                        month: "long",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                        hour12: false
                                    }).format(new Date(entry.createdAt)).replace(",", " kl.")}
                                </td>
                                <td>{entry.clicks}</td>
                                <td><Icon icon="close" onClick={() => {
                                    handleDeleteClick(entry.id)
                                }}></Icon></td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )}
            </section>
        </>
    );
}
