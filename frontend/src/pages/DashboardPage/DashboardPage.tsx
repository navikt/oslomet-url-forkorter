import {} from "./dashboardpage.style.ts";
import {Main} from "../pages.style.ts";
import CheckShortUrl from "../../components/CheckShortUrl.tsx";
import CreateShortUrl from "../../components/CreateShortUrl.tsx";
import ShowAll from "../../components/ShowAll/ShowAll.tsx";
import {useCheckLogin} from "../../util/hooks/useCheckLogin.ts";

export default function DashboardPage() {
    const { user } = useCheckLogin()

    return (
        <Main>
            <CheckShortUrl/>
            <CreateShortUrl user={user} />
            <ShowAll/>
        </Main>
    )
}