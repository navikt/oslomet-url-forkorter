import {FooterContainer, FooterContent, FooterLogo, FooterText} from "./footer.style.ts";

export default function Footer() {
    return (
        <FooterContainer>
            <FooterContent>
                <FooterLogo src="/icons/nav-logo-hvit.svg" alt="NAV logo" />
                <FooterText>Arbeids- og velferdsetaten</FooterText>
            </FooterContent>
        </FooterContainer>
    );
}
