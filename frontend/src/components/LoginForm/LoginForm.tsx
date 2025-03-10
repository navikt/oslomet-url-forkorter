import {FormEvent, useState} from "react";
import { LoginContainer, LoginInput, LoginButton } from "./loginform.style.ts";
import Link from "../shared/Link/Link.tsx";
import {apiRequest} from "../../util/api/apiRequest.ts";

interface LoginFormProps {
    onLogin: () => void;
}

export default function LoginForm({ onLogin }: LoginFormProps) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        const body = {
            "username": username,
            "password": password
        }

        apiRequest<{ token: string }>("logginn", "POST", body).then(() => {
            onLogin();
        }).catch(error => {
            setError(error.message);
            console.error(error);
        });
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
            <Link href="/">Glemt passord?</Link>
            <LoginButton type="submit">Logg inn</LoginButton>
        </LoginContainer>
    );
}
