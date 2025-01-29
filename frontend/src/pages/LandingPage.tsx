import {Main} from "./pages.style.ts";
import Search from "../components/Search/Search";
import Button from "../components/Button/Button";

export default function LandingPage() {

    return (
        <Main>
            <Search placeholder="Kontroller din lenke.." onClick={() => {}}/>
            <Button text="Logg inn" onClick={() => {console.log("Click")}}/>
        </Main>
    )
}