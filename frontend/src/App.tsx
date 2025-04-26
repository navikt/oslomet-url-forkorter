import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import LandingPage from "./pages/LandingPage/LandingPage.tsx"
import Header from "./components/Header/Header.tsx";
import Footer from "./components/Footer/Footer.tsx";
import {useCheckLogin} from "./util/hooks/useCheckLogin.ts";
import {ReactNode} from "react";
import DashboardPage from "./pages/DashboardPage/DashboardPage.tsx";
import "./App.css"

export default function App() {

    return (
        <BrowserRouter>
            <Header/>
            <main>
                <Routes>
                    <Route path="/" element={<LandingPage/>}/>
                    <Route path="/dashboard" element={
                        <ProtectedRoute>
                            <DashboardPage/>
                        </ProtectedRoute>
                    }/>
                </Routes>
            </main>
            <Footer/>
        </BrowserRouter>
    );
}

function ProtectedRoute({children}: { children: ReactNode }) {
    const {isLoggedIn, loading} = useCheckLogin();
    if (loading) {
        return <div>Loading...</div>;
    }
    return isLoggedIn ? children : <Navigate to="/"/>;
}