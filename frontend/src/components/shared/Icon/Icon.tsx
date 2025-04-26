import classes from "./icon.module.css"

interface Props {
    icon: string;
    height?: number;
    onClick?: () => void;
    color?: string;
}

export default function Icon({icon, height, onClick}: Props) {
    return (
        <img style={{height: `${height}rem`}} className={classes.icon} src={`icons/${icon}.svg`} onClick={onClick} alt="ikon"/>
    )
}