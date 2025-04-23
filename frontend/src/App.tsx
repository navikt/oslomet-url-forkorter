import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import LandingPage from "./pages/LandingPage/LandingPage.tsx"
import "./App.css"
import Header from "./components/Header/Header.tsx";
import Footer from "./components/Footer/Footer.tsx";
import {useCheckLogin} from "./util/hooks/useCheckLogin.ts";
import {ReactNode} from "react";
import DashboardPage from "./pages/DashboardPage/DashboardPage.tsx";

export default function App() {

    return (
        <BrowserRouter>
            <div style={{
                display: "flex",
                flexDirection: "column",
                minHeight: "100vh",
                backgroundColor: "white"
            }}>
                <Header />
                <div style={{ flex: 1 }}>
                    <Routes>
                        <Route path="/" element={<LandingPage />} />
                        <Route path="/dashboard" element={
                            <ProtectedRoute>
                                <DashboardPage />
                            </ProtectedRoute>
                        } />
                    </Routes>
                </div>
                <Footer />
            </div>
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