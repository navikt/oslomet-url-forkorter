import {StyledButton} from "./button.style.ts";

interface Props {
    text: string;
    onClick?: () => void;
    className?: string;
}

export default function Button({text, onClick, className}: Props) {
    return (
        <StyledButton onClick={onClick} className={className}>
            {text}
        </StyledButton>
    )
}