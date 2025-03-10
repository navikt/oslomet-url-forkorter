import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import LandingPage from "./pages/LandingPage/LandingPage.tsx"
import "./App.css"
import Header from "./components/Header/Header.tsx";
import {useAuth} from "./util/hooks/useAuth.ts";
import {ReactNode} from "react";
import DashboardPage from "./pages/DashboardPage/DashboardPage.tsx";

export default function App() {

    return (
        <BrowserRouter>
            <Header/>
            <Routes>
                <Route path={"/"} element={<LandingPage/>}/>
                <Route path={"/dashboard"} element={
                    <ProtectedRoute>
                        <DashboardPage/>
                    </ProtectedRoute>
                }></Route>
            </Routes>
        </BrowserRouter>
    )
}

function ProtectedRoute({children}: { children: ReactNode }) {
    const {isLoggedIn, loading} = useAuth();
    if (loading) {
        return <div>Loading...</div>;
    }
    return isLoggedIn ? children : <Navigate to="/"/>;
}