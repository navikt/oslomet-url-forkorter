import {isValidHttpsUrl, isValidShortLink} from "../../util/urlUtil.ts";
import {useEffect, useState} from "react";
import Input from "../shared/Input/Input.tsx";
import SegmentedButton from "../shared/SegmentedButton/SegmentedButton.tsx";
import Button from "../shared/Button/Button.tsx";
import classes from "./entryform.module.css";
import Icon from "../shared/Icon/Icon.tsx";
import {apiRequest} from "../../util/api/apiRequest.ts";

interface Props {
    initialBeskrivelse?: string;
    initialOriginalUrl?: string;
    initialCustomShortUrl?: string;
    defaultSelected?: "auto" | "manuell";
    entryId?: number | null;
    onSuccess?: () => unknown
}

export default function EntryForm({
                                      initialBeskrivelse = "",
                                      initialOriginalUrl = "",
                                      initialCustomShortUrl = "",
                                      defaultSelected = "auto",
                                      entryId = null,
                                      onSuccess,
                                  }: Props) {
    const [beskrivelse, setBeskrivelse] = useState(initialBeskrivelse);
    const [originalUrl, setOriginalUrl] = useState(initialOriginalUrl);
    const [customShortUrl, setCustomShortUrl] = useState("");
    const [selected, setSelected] = useState<"auto" | "manuell">(defaultSelected);
    const [formIsValid, setFormIsValid] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [result, setResult] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const validOriginal = isValidHttpsUrl(originalUrl);
        const validCustom = selected === "auto" || isValidShortLink(customShortUrl);
        setFormIsValid(validOriginal && validCustom);
    }, [originalUrl, customShortUrl, selected]);

    function handleSubmitClick() {

        if (!isValidHttpsUrl(originalUrl)) return;
        setLoading(true);
        const body = {
            beskrivelse: beskrivelse,
            originalurl: originalUrl,
            korturl: customShortUrl ? customShortUrl : null,
            entryid: entryId ?? null
        };
        const url = entryId ? "url/oppdater" : "url/opprett"
        apiRequest<{ forkortetUrl: string }>(url, "POST", body).then((res) => {
            if (res) setResult(res.forkortetUrl);
        }).catch(error => {
            setError(error);
            console.error(error);
        }).finally(() => {
            setLoading(false);
            onSuccess && onSuccess();
        });
    }

    const url = import.meta.env.DEV ? "http://localhost:8080/" + result : window.location.origin + "/" + result;

    return (
        <section className={classes.section} onClick={(e) => e.stopPropagation()}>
            <h2>{entryId ? "Rediger kortlenke" : "Opprett ny kortlenke"}</h2>
            <form className={classes.form}>
                <Input
                    label="Beskrivelse (valgfri):"
                    type="text"
                    placeholder="Beskrivelse av lenken din.."
                    buttonText="Opprett"
                    disableButton
                    onChange={setBeskrivelse}
                    value={beskrivelse}
                />
                <Input
                    label="Original lenke:"
                    type="text"
                    placeholder="Lim inn lenken du ønsker å forkorte.."
                    buttonText="Opprett"
                    statusIcon={originalUrl && (isValidHttpsUrl(originalUrl) ? "checkmark" : "xmark")}
                    disableButton
                    onChange={setOriginalUrl}
                    value={originalUrl}
                />
                <SegmentedButton
                    label="Kortnavn:"
                    disabled={initialCustomShortUrl != ""}
                    options={[
                        {label: "Autogenerert", value: "auto"},
                        {label: "Egendefinert", value: "manuell"},
                    ]}
                    selectedValue={selected}
                    onChange={(val) => {
                        setSelected(val as "auto" | "manuell");
                        setCustomShortUrl("");
                    }}
                />
                {entryId ? (
                    <Input placeholder={`${window.location.origin}/${initialCustomShortUrl}`}
                           disabled
                           disableButton/>
                ) : selected === "auto" ? (
                    <Input placeholder={`Autogenerer en lenke på formatet ${window.location.origin}/a1s2d3`}
                           disableButton
                           disabled/>
                ) : (
                    <Input placeholder="Egendefinert kortnavn (3 til 15 tall og bokstaver).."
                           disableButton
                           statusIcon={customShortUrl && (isValidShortLink(customShortUrl) ? "checkmark" : "xmark")}
                           onChange={setCustomShortUrl}
                           value={customShortUrl}/>
                )}
            </form>
            <Button
                text={initialOriginalUrl ? "Lagre endringer" : "Opprett lenke"}
                className={classes.opprettButton}
                disabled={!formIsValid}
                onClick={handleSubmitClick}
                loading={loading}
            />
            <div className={classes.messageArea}>
                {!loading && (error ?
                    <p>{error}</p>
                    : result && (
                    <p>
                        Lenken er forkortet! Du kan nå kopiere og dele den.
                        <br/>/
                        <a href={url} target="_blank">{url}</a>{" "}
                        (kopier: <Icon icon="copy" onClick={() => navigator.clipboard.writeText(url)} useSuccessIcon/> )
                    </p>
                ))}
            </div>
        </section>
    );
}
