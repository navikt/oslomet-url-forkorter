import styled from "styled-components";
import {ReactNode} from "react";

interface Props {
    children: ReactNode;
}

export default function Button({children}: Props) {

    return (
        <StyledButton onClick={() => console.log("click")}>
            {children}
        </StyledButton>
    )
}

const StyledButton = styled.button`
    height: 2em;
    width: 6em;
    padding: 5px;
    border-radius: 5px;
    border: none;
    background: #535bf2;
    color: #eee;

    &:hover {
        background: #464ee3;
        color: #eee;
        cursor: pointer;
    }
`