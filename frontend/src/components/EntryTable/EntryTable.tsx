import {Fragment, useEffect, useState} from "react";
import {apiRequest} from "../../util/api/apiRequest.ts";
import Icon from "../shared/Icon/Icon.tsx";
import Link from "../shared/Link/Link.tsx";
import Input from "../shared/Input/Input.tsx";
import classes from "./entrytable.module.css"
import Button from "../shared/Button/Button.tsx";
import DropdownButton from "../shared/DropdownButton/DropdownButton.tsx";
import {LineChart} from '@mui/x-charts';
import Modal from "../shared/Modal/Modal.tsx";
import EntryForm from "../EntryForm/EntryForm.tsx";
import {useCheckLogin} from "../../util/hooks/useCheckLogin.ts";

interface EntryData {
    id: number;
    description: string;
    shortUrl: string;
    longUrl: string;
    createdAt: string;
    createdBy: string | null;
    clicks: number;
}

interface ClicksPerDate {
    date: string;  // ISO date string "2025-01-01"
    count: number;
}

type SortColumn = "createdAt" | "clicks" | null;

export default function EntryTable() {
    const [filterType, setFilterType] = useState<"mine" | "alle">("mine");
    const [entries, setEntries] = useState<EntryData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortConfig, setSortConfig] = useState<{ column: SortColumn, direction: "asc" | "desc" | null } | null>(null);
    const [expandedRow, setExpandedRow] = useState<number | null>(null);
    const [clickDataMap, setClickDataMap] = useState<Record<number, ClicksPerDate[]>>({});
    const [showEditEntry, setShowEditEntry] = useState(false);
    const {user} = useCheckLogin();


    useEffect(() => {
        async function fetchEntries() {
            try {
                setLoading(true);
                const endpoint = filterType === "mine" ? "url/hentforinnloggetbruker" : "url/hentalle";
                const data = await apiRequest<EntryData[]>(endpoint);
                setEntries(data);
            } catch (err) {
                setError("Feil ved henting av liste over lenker");
                console.error("API error:", err);
            }
        }

        fetchEntries().then(() => setLoading(false));
    }, [filterType]);

    async function handleRowClick(id: number) {
        setExpandedRow((prevId) => (prevId === id ? null : id));

        if (!clickDataMap[id]) {
            try {
                const data = await apiRequest<ClicksPerDate[]>(`url/hentklikkforlenkeid?id=${id}`);
                setClickDataMap((prev) => ({...prev, [id]: data}));
            } catch (err) {
                console.error("Feil ved henting av klikkdata:", err);
            }
        }
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

    const isMobile = window.innerWidth < 700;

    return (

        <section className={classes.container}>
            <h2>Oversikt over kortlenker</h2>
            {loading && <p>Loading...</p>}
            {error && <p style={{color: "red"}}>{error}</p>}
            <div>
                <div style={{display: "flex", gap: ".5rem"}}>
                    <DropdownButton
                        changeCallback={(val) => setFilterType(val as "mine" | "alle")}
                        label="Vis eiere:"
                        options={[
                            {label: "Meg selv", value: "mine"},
                            {label: "Alle", value: "alle"},
                        ]}/>
                    <Input
                        onChange={(text) => setSearchTerm(text)}
                        value={searchTerm}
                        label="Søk:"
                        placeholder="Søk etter lenke eller eier.."
                        disableButton
                        style={{width: "100%"}}/>
                </div>
                {!loading && !error && (
                    <div className={classes.scrollContainer}>
                        <table className={classes.table}>
                            {!isMobile && (
                                <colgroup>
                                    <col style={{ width: "20%" }} />
                                    <col style={{ width: "30%" }} />
                                    <col style={{ width: "20%" }} />
                                    <col style={{ width: "23%" }} />
                                    <col style={{ width: "7%" }} />
                                </colgroup>
                            )}
                            <thead>
                            <tr>
                                <th>Kortlenke</th>
                                <th>Full lenke</th>
                                <th className={classes.hideMobile}>Eier</th>
                                <th className={classes.hideMobile} onClick={() => handleSort("createdAt")} style={{cursor: "pointer"}}>
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
                                <th onClick={() => handleSort("clicks")} style={{cursor: "pointer"}}
                                    className={`${classes.rightalign}`}>
                                    <div className={classes.icon}>
                                        #
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
                            {filteredEntries.length > 0 ? filteredEntries.map((entry) => (
                                <Fragment key={entry.id}>
                                    <tr onClick={() => handleRowClick(entry.id)}
                                        className={expandedRow == entry.id ? classes.expanded : ""}>
                                        <td>
                                            <div className={classes.copy}>
                                                <Icon icon="copy"
                                                      useSuccessIcon
                                                      onClick={(e) => {
                                                          handleCopyClick(BASE_URL + entry.shortUrl)
                                                          e.stopPropagation()
                                                      }}/>
                                                <Link href={BASE_URL + entry.shortUrl}
                                                      target="_blank"
                                                      onClick={(e) => {
                                                          e.stopPropagation()
                                                      }}
                                                      rel="noopener noreferrer">
                                                    {entry.shortUrl}
                                                </Link>
                                            </div>
                                        </td>
                                        <td>
                                            <Link href={entry.longUrl}
                                                  target="_blank"
                                                  onClick={(e) => {
                                                      e.stopPropagation()
                                                  }}
                                                  rel="noopener noreferrer">
                                                {entry.longUrl}
                                            </Link>
                                        </td>
                                        <td className={classes.hideMobile}>{entry.createdBy || "Unknown"}</td>
                                        <td className={classes.hideMobile}>
                                            {new Intl.DateTimeFormat("nb-NO", {
                                                day: "2-digit",
                                                month: "short",
                                                year: "numeric",
                                            }).format(new Date(entry.createdAt)).replace(",", " kl.")}
                                        </td>
                                        <td className={`${classes.rightalign}`}>{entry.clicks}</td>
                                    </tr>
                                    <Modal showModal={expandedRow === entry.id}
                                           setShowModal={() => setExpandedRow(null)}>
                                        <div className={classes.expandContent} onClick={e => e.stopPropagation()}>
                                            <div style={{display: "flex", gap: ".5rem"}}>
                                                <div style={{marginRight: "auto"}}>
                                                    <h4>Full lenke:</h4>
                                                    <p>{entry.longUrl}</p>
                                                    {entry.description && <>
                                                        <h4>Beskrivelse:</h4>
                                                        <p>{entry.description}</p>
                                                    </>}
                                                    <div style={{display: "flex", gap: ".5rem"}}>
                                                        <h4>Opprettet:</h4>
                                                        <p>{new Intl.DateTimeFormat("nb-NO", {
                                                            day: "2-digit",
                                                            month: "short",
                                                            year: "numeric",
                                                        }).format(new Date(entry.createdAt)).replace(",", " kl.")}</p>
                                                        <h4>Eier:</h4>
                                                        <p>{entry.createdBy}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            {clickDataMap[entry.id] && (() => {
                                                const clicksMap = clickDataMap[entry.id]
                                                    .filter((d) => {
                                                        const date = new Date(d.date);
                                                        const now = new Date();
                                                        const thirtyDaysAgo = new Date(now);
                                                        thirtyDaysAgo.setDate(now.getDate() - 30);
                                                        return date >= thirtyDaysAgo && date <= now;
                                                    })
                                                    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

                                                return (
                                                    <div style={{ background: "#eee", padding: ".5rem 0 1rem", margin: "1rem 0" }}>
                                                        <div style={{ width: '100%', height: 200 }}>
                                                            <LineChart
                                                                xAxis={[{
                                                                    data: clicksMap.map(d => d.date),
                                                                    scaleType: 'band',
                                                                    valueFormatter: val => new Date(val).toLocaleDateString('nb-NO', {
                                                                        day: '2-digit',
                                                                        month: 'short'
                                                                    }),
                                                                }]}
                                                                series={[{
                                                                    data: clicksMap.map(d => d.count),
                                                                    label: 'Klikk siste måned',
                                                                }]}
                                                                height={200}
                                                            />
                                                        </div>
                                                    </div>
                                                );
                                            })()}

                                            <div style={{
                                                display: "flex",
                                                gap: ".5rem",
                                                marginLeft: "auto",
                                                marginTop: "1rem"
                                            }}>
                                                {user === entry.createdBy && <>
                                                    <Button text="Rediger"
                                                            className={classes.expandedButton}
                                                            onClick={() => setShowEditEntry(true)}
                                                    />
                                                    <Modal showModal={showEditEntry} setShowModal={setShowEditEntry}>
                                                        <div className={classes.editContainer}>
                                                            <EntryForm entryId={entry.id}
                                                                       initialBeskrivelse={entry.description}
                                                                       initialCustomShortUrl={entry.shortUrl}
                                                                       initialOriginalUrl={entry.longUrl}
                                                                       onSuccess={() => setShowEditEntry(false)}
                                                            />
                                                        </div>
                                                    </Modal>
                                                    <Button text="Slett"
                                                            className={`${classes.expandedButton} ${classes.deleteButton}`}
                                                            onClick={() => handleDeleteClick(entry.id)}/>
                                                </>}
                                            </div>
                                        </div>
                                    </Modal>
                                </Fragment>
                            )) : <tr>
                                <td colSpan={5} style={{textAlign: "center", color: "#999"}}>Her var det ingenting.
                                    Opprett
                                    din første lenke!
                                </td>
                            </tr>}
                            </tbody>
                        </table>
                    </div>
                )}
                {/*                <div style={{display: "flex", gap: ".5rem"}}>
                    <Modal showModal={visOpprett} setShowModal={setVisOpprett}>
                        <div className={classes.opprettContainer}>
                            <CreateShortUrl/>
                        </div>
                    </Modal>
                    <Button text="Opprett" className={classes.opprettButton} onClick={() => setVisOpprett(true)}/>
                </div>*/}
            </div>
        </section>
    );
}
