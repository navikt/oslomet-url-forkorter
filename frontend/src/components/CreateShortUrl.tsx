import {isValidUrl} from "../util/urlUtil.ts";
import {apiRequest} from "../util/api/apiRequest.ts";
import {useState} from "react";
import Input from "./shared/Input/Input.tsx";

const BASE_URL = window.location.origin;

export default function CreateShortUrl() {
    const [inputValue, setInputValue] = useState("");
    const [result, setResult] = useState<string | null>(null);

    function handleCreateClick() {
        if (!isValidUrl(inputValue)) return;
        apiRequest<{ forkortetUrl: string }>(`forkort?langurl=${inputValue}`, "POST", true).then((res) => {
            if (res) setResult(res.forkortetUrl);
        }).catch(error => {
            setResult(null);
            console.error(error);
        });
    }

    const url = BASE_URL + result;

    return (
        <>
            <Input placeholder="Lim inn lenken du ønsker å forkorte.."
                   onClick={handleCreateClick}
                   onChange={setInputValue}>
            </Input>
            {result &&
                <a href={url} target="_blank">{url}</a>
            }
        </>
    )
}