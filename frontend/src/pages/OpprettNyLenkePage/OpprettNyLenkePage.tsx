import CreateShortUrl from "../../components/CreateShortUrl/CreateShortUrl.tsx";
import {useCheckLogin} from "../../util/hooks/useCheckLogin.ts";
import classes from "./opprettnylenkepage.module.css"

interface OpprettNyLenkePageProps {

}

export default function OpprettNyLenkePage({}: OpprettNyLenkePageProps) {
    const {user} = useCheckLogin()

    return (
        <div className={classes.container}>
            <CreateShortUrl user={user}/>
        </div>
    );
};