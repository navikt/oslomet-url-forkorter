import {isValidHttpsUrl, isValidShortLink} from "../../util/urlUtil.ts";
import {apiRequest} from "../../util/api/apiRequest.ts";
import {useState} from "react";
import Input from "../shared/Input/Input.tsx";
import SegmentedButton from "../shared/SegmentedButton/SegmentedButton.tsx";
import Button from "../shared/Button/Button.tsx";
import classes from "./createshorturl.module.css"
import Icon from "../shared/Icon/Icon.tsx";

export default function CreateShortUrl() {
    const [beskrivelse, setBeskrivelse] = useState("");
    const [originalUrl, setOriginalUrl] = useState("");
    const [customShortUrl, setCustomShortUrl] = useState("");
    const [loading, setLoading] = useState<boolean>(false);
    const [result, setResult] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [selected, setSelected] = useState<string>("auto");

    function handleSubmitClick() {

        if (!isValidHttpsUrl(originalUrl)) return;
        setLoading(true);
        const body = {
            beskrivelse: beskrivelse,
            originalurl: originalUrl,
            korturl: customShortUrl ? customShortUrl : null
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

    function handleCopyClick(url: string) {
        navigator.clipboard.writeText(url).then(() => {

        });
    }

    const url = import.meta.env.DEV ? "http://localhost:8080/" + result : window.location.origin + "/" + result;

    return (
        <section className={classes.section}>
            <h2>Opprett ny kortlenke</h2>
            <form className={classes.form}>
                <Input label="Beskrivelse (valgfri):"
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
                    label="Kortnavn:"
                    options={[
                        {label: "Autogenerert", value: "auto"},
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
                        placeholder={`Autogenerer en lenke på formatet ${window.location.origin}/a1s2d3`}
                        disableButton
                        disabled
                    /> :
                    <Input
                        placeholder="Egendefinert kortnavn (fra 3 til 15 tall og bokstaver).."
                        disableButton
                        statusIcon={customShortUrl && (isValidShortLink(customShortUrl) ? "checkmark" : "xmark")}
                        onChange={setCustomShortUrl}
                    />
                }
            </form>
            <Button
                text="Opprett lenke"
                className={classes.opprettButton}
                onClick={handleSubmitClick}
                loading={loading}
            />
            <div className={classes.messageArea}>
                {!loading && (error ?
                    <p>{error}</p>
                    : result && (
                    <p>
                        Great success! Her er din lenke:{" "}
                        <a href={url} target="_blank">{url}</a>{" "}
                        ( kopier: <Icon icon="copy" onClick={handleCopyClick} successIcon/> )<br/>
                        Tips: Du finner den alltid igjen i oversikten din!

                    </p>
                ))}
            </div>
        </section>
    )
}