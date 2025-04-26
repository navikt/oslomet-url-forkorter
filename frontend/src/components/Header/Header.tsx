import {useCheckLogin} from "../../util/hooks/useCheckLogin.ts";
import {useNavigate} from "react-router-dom";
import Icon from "../shared/Icon/Icon.tsx";
import classes from "./header.module.css"

export default function Header() {
    const {isLoggedIn, user, loading} = useCheckLogin();
    const navigate = useNavigate();

    if (loading) {
        return <p>Loading...</p>;
    }

    const redirectToLogin = () => {
        window.location.replace("/oauth2/login");
    }

    return (
        <header className={classes.header}>
            <img className={classes.logo} onClick={() => navigate("/")} src="/icons/nav-logo.svg" alt="NAV logo"/>
            {isLoggedIn ? (
                <div style={{display: "flex"}}>
                    <Icon icon="user"/>
                    <p className={classes.userText}>{user}</p>
                </div>
            ) : (
                <>
                    <button className={classes.button} onClick={redirectToLogin}>
                        <img src="/icons/logg-inn.svg" alt="logg inn ikon" height="30"/>
                        Logg inn
                    </button>
                </>
            )}
        </header>
    );
}
