import styled from "styled-components";

export const Main = styled.main`
    height: 80vh;
    display: flex;
    gap: 1rem;
    flex-direction: column;
    place-items: center;
    place-content: center;
`

export const WelcomeText = styled.h2`
    color: var(--theme-color);
    font-size: 60px;
`

export const InfoText = styled.p`
    color: #222;
    text-align: center;
    line-height: 1.4rem;
`

export const LogoText = styled.span`
    font-weight: bold;
    color: var(--theme-color);
`