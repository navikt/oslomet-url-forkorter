import {DisplayUser, HeaderContainer, LogoText} from "./header.style.ts";
import Button from "../shared/Button/Button.tsx";
import Modal from "../shared/Modal/Modal.tsx";
import {useState} from "react";
import LoginForm from "../LoginForm/LoginForm.tsx";
import {useAuth} from "../../util/hooks/useAuth.ts";

export default function Header() {
    const [showLogin, setShowLogin] = useState(false);
    const {isLoggedIn, user, loading, logout} = useAuth();

    if (loading) {
        return (
            <DisplayUser>Loading...</DisplayUser>
        )
    }

    return (
        <HeaderContainer>
            <LogoText>n.av</LogoText>
            {isLoggedIn ? (
                <div style={{display: "flex", alignItems: "center"}}>
                    <DisplayUser>Velkommen, {user}!</DisplayUser>
                    <Button text="Logg ut" onClick={logout}/>
                </div>
            ) : (
                <>
                    <Button text="Logg inn" onClick={() => setShowLogin(true)}/>
                    <Modal showModal={showLogin} setShowModal={setShowLogin}>
                        <LoginForm onLogin={() => setShowLogin(false)}/>
                    </Modal>
                </>
            )}
        </HeaderContainer>
    )
}