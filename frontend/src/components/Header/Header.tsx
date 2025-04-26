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
            <div className={classes.left}>
                <img className={classes.logo} onClick={() => navigate("/")} src="/icons/nav-logo.svg" alt="NAV logo"/>
                <nav className={classes.nav}>
                    <button className={classes.navbutton}>
                        Opprett ny lenke
                    </button>
                    <button className={classes.navbutton}>
                        Oversikt
                    </button>
                    <button className={classes.navbutton}>
                        Statistikk
                    </button>
                </nav>
            </div>
            <div className={classes.right}>
                {isLoggedIn ? (
                    <button className={classes.rightButton}>
                        <Icon icon="user" height={1.5}/>
                        <p className={classes.rightText}>{user}</p>
                    </button>
                ) : (
                    <button className={classes.loginButton} onClick={redirectToLogin}>
                        <Icon icon={"logg-inn"} height={2}/>
                        Logg inn
                    </button>
                )}
                <button className={classes.rightButton}>
                    <Icon icon="menu" height={1.5}/>
                    <p className={classes.rightText}>Meny</p>
                </button>
            </div>
        </header>
    );
}
