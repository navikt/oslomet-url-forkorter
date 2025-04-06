import {FormEvent, useState} from "react";
import { LoginContainer, LoginInput, LoginButton } from "./loginform.style.ts";
import Link from "../shared/Link/Link.tsx";
import {apiRequest} from "../../util/api/apiRequest.ts";
import {useNavigate} from "react-router-dom";

interface LoginFormProps {
    onLogin: () => void;
}

export default function LoginForm({ onLogin }: LoginFormProps) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        const body = {
            "username": username,
            "password": password
        }

        apiRequest<{ token: string }>("logginn", "POST", body).then(() => {
            onLogin();
            navigate("/dashboard");
        }).catch(error => {
            setError(error.message);
            console.error(error);
        })
    };

    return (
        <LoginContainer onSubmit={handleSubmit} onClick={(e) => e.stopPropagation()}>
            <h2>Velkommen tilbake!</h2>
            <LoginInput
                type="text"
                placeholder="Brukernavn"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <LoginInput
                type="password"
                placeholder="Passord"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            {error && <p style={{color: "red"}}>{error}</p>}
            <Link href="/" > <a className=" hover:underline"  style={{ color: "#003049" }}>Glemt passord? </a> </Link>
            <LoginButton type="submit">Logg inn</LoginButton>
        </LoginContainer>
    );
}
