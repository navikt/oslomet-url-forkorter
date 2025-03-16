import styled from "styled-components";

export const StyledButton = styled.button`
    height: 2.5em;
    width: 6em;
    padding: 5px;
    border-radius: 5px;
    border: none;
    background: var(--theme-color);
    color: #eee;

    &:hover {
        background: var(--theme-color-focus);
        cursor: pointer;
    }
`