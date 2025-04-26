import {} from "./dashboardpage.style.ts";
import {Main} from "../pages.style.ts";
import CheckShortUrl from "../../components/CheckShortUrl.tsx";
import CreateShortUrl from "../../components/CreateShortUrl.tsx";
import ShowAll from "../../components/ShowAll/ShowAll.tsx";

export default function DashboardPage() {

    return (
        <Main>
            <CheckShortUrl/>
            <CreateShortUrl/>
            <ShowAll/>
        </Main>
    )
}