import {SearchContainer, StyledButton, StyledInput} from "./search.style.ts";

interface Props {
    placeholder?: string;
    onClick?: () => void;
    onChange?: (value: string) => void;
}

export default function Search({placeholder, onClick, onChange}: Props) {
    return (
        <SearchContainer>
            <StyledInput type="search" placeholder={placeholder} onChange={(e) => onChange?.(e.target.value)}/>
            <StyledButton text="Søk" onClick={onClick}/>
        </SearchContainer>
    )
}