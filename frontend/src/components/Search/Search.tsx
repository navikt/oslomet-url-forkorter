import styled from "styled-components";

interface Props {
    placeholder?: string;
}

export default function Search({placeholder}: Props) {

    return (
        <Input type="search" placeholder={placeholder}></Input>
    )
}

const Input = styled.input`
    height: 3em;
    width: 25vw;
    padding: 10px;
    border-radius: 5px;
    border: 1px solid grey;
`