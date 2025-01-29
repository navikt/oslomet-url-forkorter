import styled from "styled-components";

interface Props {
    text: string;
    onClick?: () => void;
}

export default function Button({text, onClick}: Props) {

    return (
        <StyledButton onClick={onClick}>
            {text}
        </StyledButton>
    )
}

const StyledButton = styled.button`
    height: 2em;
    width: 6em;
    padding: 5px;
    border-radius: 5px;
    border: none;
    background: var(--theme-color);
    color: #eee;

    &:hover {
        background: var(--theme-color-hover);
        color: #eee;
        cursor: pointer;
    }
`