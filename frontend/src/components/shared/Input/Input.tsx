import {InputContainer, StyledButton, StyledInput} from "./input.style.ts";

interface Props {
    placeholder?: string;
    buttonText?: string;
    onClick?: () => void;
    onChange?: (value: string) => void;
}

export default function Input({placeholder, buttonText = "Opprett", onClick, onChange}: Props) {
    return (
        <InputContainer>
            <StyledInput type="search" placeholder={placeholder} onChange={(e) => onChange?.(e.target.value)}/>
            <StyledButton text={buttonText} onClick={onClick}/>
        </InputContainer>
    )
}