import classes from "./footer.module.css"

export default function Footer() {
    return (
        <footer className={classes.footer}>
            <div>
                <img src="/icons/nav-logo-hvit.svg" alt="NAV logo" />
                <p>Arbeids- og velferdsetaten</p>
            </div>
        </footer>
    );
}
