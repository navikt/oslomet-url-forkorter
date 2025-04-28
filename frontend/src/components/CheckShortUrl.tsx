import {extractShortUrl} from "../util/urlUtil.ts";
import {apiRequest} from "../util/api/apiRequest.ts";
import {useState} from "react";
import Input from "./shared/Input/Input.tsx";

export default function CheckShortUrl() {
    const [inputValue, setInputValue] = useState("");
    const [searchResult, setSearchResult] = useState<string | null>(null);

    function handleSearchClick() {
        const shortUrl = extractShortUrl(inputValue)
        if (shortUrl === null || shortUrl.length !== 6) {
            console.log("test")
            return;
        }
        apiRequest<{langurl: string }>(`url/sjekk?korturl=${shortUrl}`, "POST").then((res) => {
            if (res) setSearchResult(res.langurl);
            else setSearchResult(null);
        }).catch(error => {
            setSearchResult(null);
            console.error(error);
        });
    }

    return (
        <>
            <Input placeholder="Kontroller din lenke.."
                    onClick={handleSearchClick}
                    onChange={setInputValue}>
            </Input>

            <div>{searchResult}</div>
        </>
    )
}