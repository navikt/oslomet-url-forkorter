import classes from "./icon.module.css"

interface Props {
    icon: string;
    onClick?: () => void;
    color?: string;
}

export default function Icon({icon, onClick}: Props) {
    return (
        <img className={classes.icon} src={`icons/${icon}.svg`} onClick={onClick}/>
    )
}