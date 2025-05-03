import {useCheckLogin} from "../../util/hooks/useCheckLogin.ts";
import {Link, useLocation, useNavigate} from "react-router-dom";
import Icon from "../../components/shared/Icon/Icon.tsx";
import classes from "./header.module.css"
import {useDropdownManager} from "../../util/hooks/useDropdownManager.ts";
import {useEffect} from "react";

export default function Header() {
    const {isLoggedIn, user, loading} = useCheckLogin();
    const navigate = useNavigate();
    const location = useLocation();
    const { isOpen, toggleDropdown, closeDropdown } = useDropdownManager();

    useEffect(() => {
        closeDropdown();
    },[window.location.href])


    if (loading) {
        return <p>Loading...</p>;
    }

    const BASE_URL = import.meta.env.DEV ? "http://localhost:8080" : window.location.origin;

    const redirectToLogin = () => {
        window.location.href = BASE_URL + '/oauth2/login';
    }

    const redirectToLogout = () => {
        window.location.href = BASE_URL + '/oauth2/logout';
    }

    return (
        <header className={classes.header}>
            <div className={classes.left}>
                <img className={classes.logo} onClick={() => navigate("/")} src="/icons/nav-logo.svg" alt="NAV logo"/>
                <nav className={`${isLoggedIn ? "" : classes.hide} ${classes.nav}`}>
                    <Link to={"/dashboard"}>
                        <button
                            className={`${location.pathname === "/dashboard" ? classes.active : ""} ${classes.navbutton}`}>
                            Administrer lenker
                        </button>
                    </Link>
                </nav>
            </div>
            <div className={classes.right}>
                {isLoggedIn ? (
                    <div style={{position: "relative"}}>
                        <button className={classes.rightButton}
                                onClick={() => toggleDropdown("user")}>
                            <Icon icon="user" height={1.5}/>
                            <p className={classes.rightText}>{user}</p>
                        </button>
                        {isOpen("user") && (
                            <>
                                <div className={classes.backdrop} onClick={closeDropdown}/>
                                <div className={classes.dropdown}>
                                    <button className={classes.dropdownButton}
                                            onClick={redirectToLogout}>
                                        Logg ut
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                ) : (
                    <button className={classes.rightButton} onClick={redirectToLogin}>
                        <Icon icon={"logg-inn"} height={1.55}/>
                        <p className={classes.rightText}>Logg inn</p>
                    </button>
                )}
                <button className={`${isLoggedIn ? "" : classes.hide} ${classes.rightButton}`} onClick={() => toggleDropdown("menu")}>
                    {isOpen("menu") ? <Icon icon="close" height={1.5}/> : <Icon icon="menu" height={1.5}/> }
                    <p className={classes.rightText}>Meny</p>
                </button>
                {isOpen("menu") && (
                    <div style={{position: "relative"}}>
                        <div className={classes.backdrop} onClick={closeDropdown}/>
                        <div className={classes.dropdown}>
                            <button className={classes.dropdownButton}
                                    onClick={() => {navigate("/dashboard"); closeDropdown();}}>
                                Administrer lenker
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
}
