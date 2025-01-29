import {SearchContainer, StyledButton, StyledInput} from "./search.style.ts";

interface Props {
    placeholder?: string;
    onClick?: () => void;
}

export default function Search({placeholder, onClick}: Props) {
    return (
        <SearchContainer>
            <StyledInput type="search" placeholder={placeholder}/>
            <StyledButton text="Søk" onClick={onClick}/>
        </SearchContainer>
    )
}