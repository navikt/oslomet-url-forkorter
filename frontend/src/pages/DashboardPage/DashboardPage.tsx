import CheckShortUrl from "../../components/CheckShortUrl.tsx";
import CreateShortUrl from "../../components/CreateShortUrl.tsx";
import EntryTable from "../../components/EntryTable/EntryTable.tsx";
import {useCheckLogin} from "../../util/hooks/useCheckLogin.ts";

export default function DashboardPage() {
    const { user } = useCheckLogin()

    return (
        <>
            <CheckShortUrl/>
            <CreateShortUrl user={user} />
            <EntryTable/>
        </>
    )
}