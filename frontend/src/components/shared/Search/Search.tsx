import {SearchContainer, StyledButton, StyledInput} from "./search.style.ts";
import {CSSProperties} from "react";

interface Props {
    placeholder?: string;
    onClick?: () => void;
    onChange?: (value: string) => void;
    disableButton?: boolean;
    style?: CSSProperties;
}

export default function Search({placeholder, onClick, onChange, disableButton, style}: Props) {
    return (
        <SearchContainer style={style}>
            <StyledInput
                type="search"
                placeholder={placeholder}
                onChange={(e) => onChange?.(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        onClick?.();
                    }
                }}
            />
            {!disableButton && <StyledButton text="Søk" onClick={onClick}/>}
        </SearchContainer>
    )
}