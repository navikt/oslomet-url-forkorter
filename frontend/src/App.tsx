import {BrowserRouter, Route, Routes} from "react-router-dom";
import LandingPage from "./pages/LandingPage.tsx"
import './App.css'

export default function App() {

    return (
        <BrowserRouter>
            <main>
                <Routes>
                    <Route path={"/"} element={<LandingPage/>}/>
                    <Route path={"/user/:id"} element={<div></div>}></Route>
                </Routes>
            </main>
        </BrowserRouter>
    )
}