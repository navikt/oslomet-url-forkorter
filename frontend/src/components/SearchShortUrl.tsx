import Search from "./shared/Search/Search.tsx";
import {extractShortUrl} from "../util/urlUtil.ts";
import {apiRequest} from "../util/api/apiRequest.ts";
import {useState} from "react";

export default function SearchShortUrl() {
    const [inputValue, setInputValue] = useState("");
    const [searchResult, setSearchResult] = useState<string | null>(null);

    function handleSearchClick() {
        const shortUrl = extractShortUrl(inputValue)
        if (shortUrl === null || shortUrl.length !== 6) {
            console.log("test")
            return;
        }
        apiRequest<{langurl: string }>(`sjekk?korturl=${shortUrl}`, "POST").then((res) => {
            if (res) setSearchResult(res.langurl);
            else setSearchResult(null);
        }).catch(error => {
            setSearchResult(null);
            console.error(error);
        });
    }

    return (
        <>
            <Search placeholder="Kontroller din lenke.."
                    onClick={handleSearchClick}
                    onChange={setInputValue}>
            </Search>
            <div>{searchResult}</div>
        </>
    )
}