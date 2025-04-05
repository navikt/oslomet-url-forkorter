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

export default function Header() {
    const [showLogin, setShowLogin] = useState(false);
    const { isLoggedIn, user, loading, logout } = useAuth();

    if (loading) {
        return <DisplayUser>Loading...</DisplayUser>;
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
                    <StyledButton onClick={() => setShowLogin(true)}>
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
