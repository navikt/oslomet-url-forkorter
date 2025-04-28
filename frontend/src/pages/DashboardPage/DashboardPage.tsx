import EntryTable from "../../components/EntryTable/EntryTable.tsx";
import classes from "./dashboardpage.module.css";

export default function DashboardPage() {

    return (
        <div className={classes.container}>
            <EntryTable/>
        </div>
    )
}