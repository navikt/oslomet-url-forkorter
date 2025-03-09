import {Main} from "./pages.style.ts";
import Button from "../components/shared/Button/Button";
import SearchShortUrl from "../components/SearchShortUrl.tsx";
import CreateShortUrl from "../components/CreateShortUrl.tsx";
import ShowAllUrls from "../components/ShowAll/ShowAll.tsx";

export default function LandingPage() {

    return (
        <Main>
            <CreateShortUrl/>
            <SearchShortUrl/>
            <Button text="Logg inn" onClick={() => {console.log("Click")}}/>
            <ShowAllUrls/>
        </Main>
    )
}