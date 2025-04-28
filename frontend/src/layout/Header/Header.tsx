import {useCheckLogin} from "../../util/hooks/useCheckLogin.ts";
import {Link, useNavigate} from "react-router-dom";
import Icon from "../../components/shared/Icon/Icon.tsx";
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
                    <Link to={"/opprettnylenke"}>
                        <button className={classes.navbutton}>
                            Opprett ny lenke
                        </button>
                    </Link>
                    <Link to={"/dashboard"}>
                        <button className={classes.navbutton}>
                            Oversikt
                        </button>
                    </Link>
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
                    <button className={classes.rightButton} onClick={redirectToLogin}>
                        <Icon icon={"logg-inn"} height={1.55}/>
                        <p className={classes.rightText}>Logg inn</p>
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
