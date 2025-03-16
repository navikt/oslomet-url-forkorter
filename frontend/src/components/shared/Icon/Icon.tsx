import {StyledIcon} from "./icon.style.ts";

interface Props {
    icon: string;
    onClick?: () => void;
    color?: string;
}

export default function Icon({icon, onClick}: Props) {
    return (
        <StyledIcon src={`icons/${icon}.svg`} onClick={onClick}/>
    )
}