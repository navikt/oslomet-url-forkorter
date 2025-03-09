import {isValidUrl} from "../util/urlUtil.ts";
import {apiRequest} from "../util/api/apiRequest.ts";
import {useState} from "react";
import Input from "./shared/Input/Input.tsx";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export default function CreateShortUrl() {
    const [inputValue, setInputValue] = useState("");
    const [result, setResult] = useState<string | null>(null);

    async function postShortUrlSearch(longUrl: string) {
        try {
            return await apiRequest<{ forkortetUrl: string }>(`forkort?langurl=${longUrl}`, "POST");
        } catch (error) {
            console.error("API error:", error);
        }
    }

    function handleCreateClick() {
        if (!isValidUrl(inputValue)) return;
        postShortUrlSearch(inputValue).then((res) => {
            if (res) setResult(res.forkortetUrl);
        }).catch(error => {
            setResult(null);
            console.error(error);
        });
    }

    const url = BASE_URL + result;

    return (
        <>
            <Input placeholder="Skriv inn din lenke.."
                   onClick={handleCreateClick}
                   onChange={setInputValue}>
            </Input>
            {result &&
            <a href={url} target="_blank">{url}</a>
            }
        </>
    )
}