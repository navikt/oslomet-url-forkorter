import {useState, useEffect} from "react";
import {apiRequest} from "../api/apiRequest.ts";

export function useCheckLogin() {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [user, setUser] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkLoginStatus()
    }, []);

    const checkLoginStatus = () => {
        setLoading(true);
        apiRequest<any>("bruker", "GET").then((data) => {
            if (data) {
                setIsLoggedIn(true);
/*                setUser(data.username);*/
                console.log("Logget inn som: ", data);
            } else {
                setIsLoggedIn(false);
                setUser(null);
            }
        }).catch((error) => {
            console.error("Innloggetstatus:", {
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
