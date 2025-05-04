import {extractShortUrl, isValidShortenedLink} from "../../util/urlUtil.ts";
import {apiRequest} from "../../util/api/apiRequest.ts";
import {useState} from "react";
import Input from "../shared/Input/Input.tsx";
import classes from "./checkshorturl.module.css";

const feedbackArray = [
    "Damn son, du har en gyldig lenke!",
    "Woow, du fakker ikke med ugyldige lenker as!",
    "Shit, flekser med gyldig lenke!"
]

export default function CheckShortUrl() {
    const [shortLink, setShortLink] = useState("");
    const [isNotValid, setIsNotValid] = useState<boolean>(false);
    const [isNotFound, setIsNotFound] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [searchResult, setSearchResult] = useState<string | null>(null);
    const [feedback, setFeedback] = useState<string | null>(null);

    function handleSearchClick() {
        setIsNotValid(false);
        setIsNotFound(false);
        setError(null)
        setSearchResult(null);
        if (!shortLink) return;
        if (!isValidShortenedLink(shortLink)) {
            setIsNotValid(true);
            return;
        }
        const shortUrl = extractShortUrl(shortLink)
        if (shortUrl === null) {
            setSearchResult(null);
            setIsNotValid(true);
            return;
        }
        setIsLoading(true);
        apiRequest<{ langurl: string }>(`url/sjekk?korturl=${shortUrl}`, "POST").then((res) => {
            if (res) {
                setSearchResult(res.langurl);
                setFeedback(feedbackArray[Math.floor(Math.random() * feedbackArray.length)]);
            }
            else setSearchResult(null);
        }).catch(error => {
            setSearchResult(null);
            if (error.response.status === 404) {
                setIsNotFound(true);
            } else {
                setError(error);
            }
            console.error(error);
        }).finally(() => {
            setIsLoading(false);
        });
    }

    return (
        <section className={classes.section}>
            <Input placeholder="Kontroller din lenke.."
                   value={shortLink}
                   loading={isLoading}
                   onClick={handleSearchClick}
                   onChange={setShortLink}>
            </Input>
            <div className={classes.messagePlaceholder}>
                {isNotValid && <p className={classes.red}>Lenken er ikke en gyldig kortlenke!</p>}
                {isNotFound && <p className={classes.red}>Lenken finnes ikke i databasen!</p>}
                {error && <p className={classes.red}>Databasefeil: {error}</p>}
                {searchResult && <>
                    <p>{feedback}</p>
                    <a href={searchResult}>{searchResult}</a>
                </>}
            </div>
        </section>
    )
}