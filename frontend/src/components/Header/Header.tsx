import {
    DisplayUser,
    HeaderContainer,
    LogoText,
    StyledButton
} from "./header.style.ts";
import {useCheckLogin} from "../../util/hooks/useCheckLogin.ts";

export default function Header() {
    const {isLoggedIn, user, loading} = useCheckLogin();

    if (loading) {
        return <DisplayUser>Loading...</DisplayUser>;
    }

    const redirectToLogin = () => {
        window.location.replace("/oauth2/login");
    }

    return (
        <HeaderContainer>
            <LogoText src="/icons/nav-logo.svg" alt="NAV logo"/>

            {isLoggedIn ? (
                <div style={{display: "flex", alignItems: "center"}}>
                    <DisplayUser>Velkommen, {user}!</DisplayUser>
                    <StyledButton onClick={() => {}}>Logg ut</StyledButton>
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
