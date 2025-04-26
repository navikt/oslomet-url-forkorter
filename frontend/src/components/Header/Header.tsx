import {
    DisplayUser,
    HeaderContainer,
    LogoText,
    StyledButton
} from "./header.style.ts";
import {useCheckLogin} from "../../util/hooks/useCheckLogin.ts";
import {useNavigate} from "react-router-dom";
import Icon from "../shared/Icon/Icon.tsx";

export default function Header() {
    const {isLoggedIn, user, loading} = useCheckLogin();
    const navigate = useNavigate();

    if (loading) {
        return <DisplayUser>Loading...</DisplayUser>;
    }

    const redirectToLogin = () => {
        window.location.replace("/oauth2/login");
    }

    return (
        <HeaderContainer>
            <LogoText onClick={() => navigate("/")} src="/icons/nav-logo.svg" alt="NAV logo"/>
            {isLoggedIn ? (
                <div style={{display: "flex"}}>
                    <Icon icon="user"/>
                    <DisplayUser>{user}</DisplayUser>
                </div>
            ) : (
                <>
                    <StyledButton onClick={redirectToLogin}>
                        <img src="/icons/logg-inn.svg" alt="logg inn ikon" height="30"/>
                        Logg inn
                    </StyledButton>
                </>
            )}
        </HeaderContainer>
    );
}
