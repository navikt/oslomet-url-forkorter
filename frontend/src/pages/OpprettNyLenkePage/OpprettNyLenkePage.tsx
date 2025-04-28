import CreateShortUrl from "../../components/CreateShortUrl/CreateShortUrl.tsx";
import classes from "./opprettnylenkepage.module.css"
import EntryTable from "../../components/EntryTable/EntryTable.tsx";

interface OpprettNyLenkePageProps {

}

export default function OpprettNyLenkePage({}: OpprettNyLenkePageProps) {

    return (
        <div className={classes.container}>
            <CreateShortUrl/>
            <EntryTable/>
        </div>
    );
};