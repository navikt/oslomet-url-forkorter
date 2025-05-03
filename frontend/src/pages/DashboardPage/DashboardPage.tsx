import EntryTable from "../../components/EntryTable/EntryTable.tsx";
import classes from "./dashboardpage.module.css";
import EntryForm from "../../components/EntryForm/EntryForm.tsx";

export default function DashboardPage() {

    return (
        <div className={classes.container}>
            <EntryForm/>
            <EntryTable/>
        </div>
    )
}