import {isValidUrl} from "../util/urlUtil.ts";
import {apiRequest} from "../util/api/apiRequest.ts";
import {useState} from "react";
import Input from "./shared/Input/Input.tsx";

interface CreateShortUrlProps {
    user: string | null;
}

export default function CreateShortUrl({user}: CreateShortUrlProps) {
    const [inputValue, setInputValue] = useState("");
    const [result, setResult] = useState<string | null>(null);

    function handleCreateClick() {
        if (!isValidUrl(inputValue) || !user) return;
        const body = {
            url: inputValue,
            bruker: user
        };
        apiRequest<{ forkortetUrl: string }>("url/opprett", true, "POST", body).then((res) => {
            if (res) setResult(res.forkortetUrl);
        }).catch(error => {
            setResult(null);
            console.error(error);
        });
    }

    const url =  window.location.origin + result;

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