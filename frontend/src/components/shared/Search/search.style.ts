import styled from "styled-components";
import Button from "../Button/Button.tsx";

export const SearchContainer = styled.div`
    display: flex;
    align-items: center;
    position: relative;
    width: 40vw;
`

export const StyledInput = styled.input`
    width: 100%;
    padding: 10px;
    border-radius: 5px;
    outline: none;
    border: 2px solid;
    color: #003049;

    &:focus {
        border: 2px solid;
        color:#003049;
    }
`

export const StyledButton = styled(Button)`
    position: absolute;
    right: 0;
    height: 100%;
    width: 5em;
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    color: white;
    background-color: #003049;
`