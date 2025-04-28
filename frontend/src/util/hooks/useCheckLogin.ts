import {useState, useEffect} from "react";
import {apiRequest} from "../api/apiRequest.ts";

interface BrukerResponse {
    navIdent: string;
    name: string;
    preferredUsername: string;
}

export function useCheckLogin() {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [user, setUser] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkLoginStatus()
    }, []);

    const checkLoginStatus = () => {
        setLoading(true);
        apiRequest<BrukerResponse>("bruker/hent").then((data) => {
            if (data) {
                setIsLoggedIn(true);
                setUser(data.navIdent);
                console.log("Logget inn som: ", data);
            } else {
                setIsLoggedIn(false);
                setUser(null);
            }
        }).catch((error) => {
            if (import.meta.env.DEV) {
                setIsLoggedIn(true);
                setUser("Test Brukersen");
                console.warn("Kjører i DEV, setter dummy-bruker");
            } else {
                console.error("Login status feil:", {
                    message: error.message,
                    response: error.response
                });
                setIsLoggedIn(false);
                setUser(null);
            }
        }).finally(() => {
            setLoading(false);
        });
    }

    return {isLoggedIn, user, loading, checkLoginStatus};
}
