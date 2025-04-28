import {useState, useEffect} from "react";
import {apiRequest} from "../api/apiRequest.ts";
import {useNavigate} from "react-router-dom";

interface BrukerResponse {
    navIdent: string;
    name: string;
    preferredUsername: string;
}

export function useCheckLogin() {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [user, setUser] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        checkLoginStatus()
    }, []);

    const checkLoginStatus = () => {
        setLoading(true);
        apiRequest<BrukerResponse>("bruker/hent").then((data) => {
            if (data) {
                setIsLoggedIn(true);
                setUser(data.navIdent);
                navigate("/opprettnylenke");
                console.log("Logget inn som: ", data);
            } else {
                setIsLoggedIn(false);
                setUser(null);
            }
        }).catch((error) => {
            console.error("Login status feil:", {
                message: error.message,
                response: error.response
            });
            setIsLoggedIn(false);
            setUser(null);
        }).finally(() => {
            setLoading(false);
        });
    }

    return {isLoggedIn, user, loading, checkLoginStatus};
}
