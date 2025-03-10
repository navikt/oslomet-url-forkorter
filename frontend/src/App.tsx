import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import LandingPage from "./pages/LandingPage.tsx"
import "./App.css"
import Header from "./components/Header/Header.tsx";
import {useAuth} from "./util/hooks/useAuth.ts";
import {ReactNode} from "react";

export default function App() {

    return (
        <BrowserRouter>
            <Header/>
            <Routes>
                <Route path={"/"} element={<LandingPage/>}/>
                <Route path={"/user/:id"} element={
                    <ProtectedRoute>
                        <div></div>
                    </ProtectedRoute>
                }></Route>
            </Routes>
        </BrowserRouter>
    )
}

function ProtectedRoute({children}: { children: ReactNode }) {
    const {isLoggedIn} = useAuth();
    return isLoggedIn ? children : <Navigate to="/"/>;
}