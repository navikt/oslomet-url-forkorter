import {useState, useEffect} from "react";
import {apiRequest} from "../api/apiRequest.ts";
import {useNavigate} from "react-router-dom";

export function useAuth() {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [user, setUser] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        checkLoginStatus()
    }, []);

    const checkLoginStatus = () => {
        setLoading(true);
        apiRequest<{ username: string }>("bruker", "GET").then((data) => {
            if (data && data.username) {
                setIsLoggedIn(true);
                setUser(data.username);
                console.log("Logget inn som: " + data.username + isLoggedIn);
            } else {
                setIsLoggedIn(false);
                setUser(null);
            }
        }).catch((error) => {
            console.error("Innloggetstatus:", error.message);
            setIsLoggedIn(false);
            setUser(null);
        }).finally(() => {
            setLoading(false);
        });
    }

    const logout = async () => {
        apiRequest<void>("loggut", "POST").then(() => {
            setIsLoggedIn(false);
            setUser(null);
            navigate("/")
        }).catch((error) => {
            console.error("Klarte ikke å logge ut:", error.message);
        });
    }
    return {isLoggedIn, user, loading, checkLoginStatus, logout};
}
