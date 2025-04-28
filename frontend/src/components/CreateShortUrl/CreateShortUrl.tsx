import {isValidHttpsUrl} from "../../util/urlUtil.ts";
import {apiRequest} from "../../util/api/apiRequest.ts";
import {useState} from "react";
import Input from "../shared/Input/Input.tsx";
import SegmentedButton from "../shared/SegmentedButton/SegmentedButton.tsx";
import Button from "../shared/Button/Button.tsx";
import classes from "./createshorturl.module.css"

interface CreateShortUrlProps {
    user: string | null;
}

export default function CreateShortUrl({user}: CreateShortUrlProps) {
    const [beskrivelse, setBeskrivelse] = useState("");
    const [originalUrl, setOriginalUrl] = useState("");
    const [customShortUrl, setCustomShortUrl] = useState("");
    const [loading, setLoading] = useState<boolean>(false);
    const [result, setResult] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [selected, setSelected] = useState<string>("auto");

    function handleSubmitClick() {

        if (!isValidHttpsUrl(originalUrl) || !user) return;
        setLoading(true);
        const body = {
            beskrivelse: beskrivelse,
            originalurl: originalUrl,
            korturl: customShortUrl ? customShortUrl : null,
            bruker: user
        };
        apiRequest<{ forkortetUrl: string }>("url/opprett", "POST", body).then((res) => {
            if (res) setResult(res.forkortetUrl);
        }).catch(error => {
            setError(error);
            console.error(error);
        }).finally(() => {
            setLoading(false);
        });
    }

    const url = import.meta.env.DEV ? "http://localhost:8080/" + result : window.location.origin + "/" + result;

    return (
        <section className={classes.section}>
            <h2>Opprett ny lenke</h2>
            <form className={classes.form}>
                <Input label="Beskrivelse:"
                       placeholder="Beskrivelse av lenken din.."
                       buttonText="Opprett"
                       disableButton
                       onChange={setBeskrivelse}>
                </Input>
                <Input label="Original lenke:"
                       placeholder="Lim inn lenken du ønsker å forkorte.."
                       buttonText="Opprett"
                       statusIcon={originalUrl && (isValidHttpsUrl(originalUrl) ? "checkmark" : "xmark")}
                       disableButton
                       onChange={setOriginalUrl}>
                </Input>
                <SegmentedButton
                    label="Lenketekst:"
                    options={[
                        {label: "Autogenerer", value: "auto"},
                        {label: "Egendefinert", value: "manuell"},
                    ]}
                    selectedValue={selected}
                    onChange={(val) => {
                        setCustomShortUrl("")
                        setSelected(val)
                    }}
                />
                {selected === "auto" ?
                    <Input
                           placeholder={`Du vil få en lenke på formatet ${window.location.origin}/a1s2d3`}
                           disableButton
                           disabled
                    /> :
                    <Input
                           placeholder="Skriv inn ønsket egendefinert suffix.."
                           disableButton
                           onChange={setCustomShortUrl}
                    />
                }
            </form>
            <Button
                text="Opprett ny lenke"
                className={classes.opprettButton}
                onClick={handleSubmitClick}
                loading={loading}
            />
            {!loading && (error ?
                <p>{error}</p>
                : result && (
                <a href={url} target="_blank">{url}</a>
            ))}

        </section>
    )
}