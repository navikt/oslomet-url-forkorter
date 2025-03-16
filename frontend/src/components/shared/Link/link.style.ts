import styled from "styled-components";

export const StyledLink = styled.a`
    color: var(--theme-color);
    text-decoration: none;
    font-weight: bold;

    &:hover {
        text-decoration: underline;
    }
`;