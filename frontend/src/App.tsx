import {HashRouter, Navigate, Route, Routes} from "react-router-dom";
import LandingPage from "./pages/LandingPage/LandingPage.tsx"
import Header from "./layout/Header/Header.tsx";
import Footer from "./layout/Footer/Footer.tsx";
import {useCheckLogin} from "./util/hooks/useCheckLogin.ts";
import {ReactNode} from "react";
import DashboardPage from "./pages/DashboardPage/DashboardPage.tsx";
import "./App.css"
import OpprettNyLenkePage from "./pages/OpprettNyLenkePage/OpprettNyLenkePage.tsx";

export default function App() {

    return (
        <HashRouter>
            <Header/>
            <main>
                <Routes>
                    <Route path="/" element={<LandingPage/>}/>
                    <Route path="/opprettnylenke" element={
                        <ProtectedRoute>
                            <OpprettNyLenkePage/>
                        </ProtectedRoute>
                    }/>
                    <Route path="/dashboard" element={
                        <ProtectedRoute>
                            <DashboardPage/>
                        </ProtectedRoute>
                    }/>
                </Routes>
            </main>
            <Footer/>
        </HashRouter>
    );
}

function ProtectedRoute({children}: { children: ReactNode }) {
    const {isLoggedIn, loading} = useCheckLogin();
    if (loading) {
        return <div>Loading...</div>;
    }
    return isLoggedIn ? children : <Navigate to="/"/>;
}