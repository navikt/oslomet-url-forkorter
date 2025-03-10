import {} from "./dashboardpage.style.ts";
import {Main} from "../pages.style.ts";
import SearchShortUrl from "../../components/SearchShortUrl.tsx";
import CreateShortUrl from "../../components/CreateShortUrl.tsx";
import ShowAll from "../../components/ShowAll/ShowAll.tsx";

export default function DashboardPage() {

    return (
        <Main>
            <SearchShortUrl/>
            <CreateShortUrl/>
            <ShowAll/>
        </Main>
    )
}