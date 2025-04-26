import {InfoText, LogoText, WelcomeText} from "./landingpage.style.ts";
import {Main} from "../pages.style.ts";
import CheckShortUrl from "../../components/CheckShortUrl.tsx";

export default function LandingPage() {

    return (
        <Main>
            <WelcomeText>Velkommen</WelcomeText>
            <InfoText><LogoText>n.av</LogoText> er en tjeneste levert av NAV. <br/> Har du mottatt en link fra oss og vil dobbelsjekke denne? <br/> Lim den inn i søkefeltet under!</InfoText>
            <CheckShortUrl/>
        </Main>
    )
}