import CheckShortUrl from "../../components/CheckShortUrl/CheckShortUrl.tsx";
import classes from "./landingpage.module.css"

export default function LandingPage() {

    return (
        <section className={classes.section}>
            <h2 className={classes.welcomeText}>Har du mottatt en lenke fra oss?</h2>
            <p className={classes.infoText}><span className={classes.logoText}>kort.nav.no</span> er en tjeneste levert av Nav. <br/> Har du mottatt en lenke fra oss og vil dobbelsjekke denne? <br/> Lim den inn i søkefeltet under!</p>
            <CheckShortUrl/>
        </section>
    )
}