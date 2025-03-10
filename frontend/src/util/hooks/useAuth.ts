import {useState, useEffect} from "react";
import {apiRequest} from "../api/apiRequest.ts";

export function useAuth() {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [user, setUser] = useState<string | null>(null);

    useEffect(() => {
        checkLoginStatus()
    }, []);

    const checkLoginStatus = () => {
        apiRequest<{ username: string }>("bruker", "GET").then((data) => {
            if (data && data.username) {
                setIsLoggedIn(true);
                setUser(data.username);
            } else {
                setIsLoggedIn(false);
                setUser(null);
            }
        }).catch((error) => {
            console.error("Klarte ikke å hente innloggetstatus:", error.message);
            setIsLoggedIn(false);
            setUser(null);
        });
    }

    const logout = async () => {
        apiRequest<void>("loggut", "POST").then(() => {
            setIsLoggedIn(false);
            setUser(null);
        }).catch((error) => {
            console.error("Klarte ikke å logge ut:", error.message);
        });
    }
    return {isLoggedIn, user, logout};
}
