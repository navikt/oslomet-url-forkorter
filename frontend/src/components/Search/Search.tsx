import styled from "styled-components";

interface Props {
    placeholder?: string;
}

export default function Search({placeholder}: Props) {

    return (
        <StyledInput type="search" placeholder={placeholder}></StyledInput>
    )
}

const StyledInput = styled.input`
    height: 3em;
    width: 25vw;
    padding: 10px;
    border-radius: 5px;
    border: 1px solid grey;
    
    &:active {
        border: 1px solid var(--theme-color);
    }
`