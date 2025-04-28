import {Fragment, useEffect, useState} from "react";
import {apiRequest} from "../../util/api/apiRequest.ts";
import Icon from "../shared/Icon/Icon.tsx";
import Link from "../shared/Link/Link.tsx";
import Input from "../shared/Input/Input.tsx";
import classes from "./entrytable.module.css"
import Button from "../shared/Button/Button.tsx";

interface EntryData {
    id: number;
    description: string;
    shortUrl: string;
    longUrl: string;
    createdAt: string;
    createdBy: string | null;
    clicks: number;
}

type SortColumn = "createdAt" | "clicks" | null;

export default function EntryTable() {
    const [entries, setEntries] = useState<EntryData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortConfig, setSortConfig] = useState<{ column: SortColumn, direction: "asc" | "desc" | null } | null>(null);
    const [expandedRow, setExpandedRow] = useState<number | null>(null);

    useEffect(() => {
        async function fetchUrls() {
            try {
                const data = await apiRequest<EntryData[]>("url/hentalle");
                setEntries(data);
            } catch (err) {
                setError("Feil ved henting av liste over URLer");
                console.error("API error:", err);
            }
        }

        fetchUrls().then(() => setLoading(false));
    }, []);

    function handleRowClick(id: number) {
        setExpandedRow((prevId) => (prevId === id ? null : id));
    }

    function handleDeleteClick(id: number) {
        apiRequest<{ forkortetUrl: string }>(`url/slett?id=${id}`, "POST")
            .then(() => setEntries((prevUrls) => prevUrls.filter((url) => url.id !== id)))
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

    let filteredEntries = entries.filter((entry) =>
        entry.shortUrl.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.longUrl.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (entry.createdBy && entry.createdBy.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    if (sortConfig?.direction) {
        filteredEntries = [...filteredEntries].sort((a, b) => {
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
        filteredEntries = [...filteredEntries].sort((a, b) => a.id - b.id);
    }

    const BASE_URL = import.meta.env.DEV ? "http://localhost:8080/" : window.location.origin + "/";

    return (
        <section className={classes.container}>
            <h2>Oversikt over kortlenker</h2>
            {loading && <p>Loading...</p>}
            {error && <p style={{color: "red"}}>{error}</p>}
            <div>
                <Input
                    onChange={(text) => setSearchTerm(text)}
                    placeholder="Søk etter URL eller bruker.."
                    disableButton
                    style={{width: "100%"}}/>
                {!loading && !error && (
                    <table className={classes.table}>
                        <thead>
                        <tr>
                            <th>Kortlenke</th>
                            <th>Original URL</th>
                            <th>Eier</th>
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
                                    Besøk
                                    {sortConfig?.column === "clicks"
                                        ? sortConfig.direction === "asc"
                                            ? <Icon icon="sort-down"/>
                                            : sortConfig.direction === "desc"
                                                ? <Icon icon="sort-up"/>
                                                : <Icon icon="sort"/>
                                        : <Icon icon="sort"/>}
                                </div>
                            </th>
                        </tr>
                        </thead>
                        <tbody>
                        {filteredEntries.map((entry) => (
                            <Fragment key={entry.id}>
                                <tr onClick={() => handleRowClick(entry.id)}>
                                    <td>
                                        <div className={classes.copy}>
                                            <Icon icon="copy"
                                                  successIcon
                                                  onClick={(e) => {
                                                      handleCopyClick(BASE_URL + entry.shortUrl)
                                                      e.stopPropagation()
                                                  }}/>
                                            <Link href={BASE_URL + entry.shortUrl}
                                                  target="_blank"
                                                  onClick={(e) => {e.stopPropagation()}}
                                                  rel="noopener noreferrer">
                                                {entry.shortUrl}
                                            </Link>
                                        </div>
                                    </td>
                                    <td>
                                        <Link href={entry.longUrl}
                                              target="_blank"
                                              onClick={(e) => {e.stopPropagation()}}
                                              rel="noopener noreferrer">
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
                                </tr>
                                {expandedRow === entry.id && (
                                    <tr className={classes.expandRow}>
                                        <td colSpan={6}>
                                            <div className={classes.expandContent}>
                                                {/* Expanded content here */}
                                                <strong>Original URL:</strong> <pre>{entry.longUrl}</pre>
                                                <Button text="Slett" onClick={() => handleDeleteClick(entry.id)}/>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </Fragment>
                        ))}
                        </tbody>
                    </table>
                )}
            </div>
        </section>
    );
}
