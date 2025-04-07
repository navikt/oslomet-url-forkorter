import {
    DisplayUser,
    HeaderContainer,
    LogoText,
    StyledButton
} from "./header.style.ts";
import Modal from "../shared/Modal/Modal.tsx";
import { useState } from "react";
import LoginForm from "../LoginForm/LoginForm.tsx";
import { useAuth } from "../../util/hooks/useAuth.ts";
import {useNavigate} from "react-router-dom";

export default function Header() {
    const [showLogin, setShowLogin] = useState(false);
    const { isLoggedIn, user, loading, logout } = useAuth();
    let navigate = useNavigate();

    if (loading) {
        return <DisplayUser>Loading...</DisplayUser>;
    }

    const redirectToIdPorten = () => {
        navigate("/oauth2/login")
    }

    return (
        <HeaderContainer>
            <LogoText src="/icons/nav-logo.svg" alt="NAV logo" />

            {isLoggedIn ? (
                <div style={{ display: "flex", alignItems: "center" }}>
                    <DisplayUser>Velkommen, {user}!</DisplayUser>
                    <StyledButton onClick={logout}>Logg ut</StyledButton>
                </div>
            ) : (
                <>
                    <StyledButton onClick={redirectToIdPorten}>
                        <img src="/icons/logg-inn.svg" alt="logg inn ikon" height="30" />Logg inn

                    </StyledButton>
                    <Modal showModal={showLogin} setShowModal={setShowLogin}>
                        <LoginForm onLogin={() => setShowLogin(false)} />
                    </Modal>
                </>
            )}
        </HeaderContainer>
    );
}
