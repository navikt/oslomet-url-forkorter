import classes from "./icon.module.css"
import {useState} from "react";

interface Props {
    icon: string;
    height?: number;
    onClick?: (e: any) => unknown;
    useSuccessIcon?: boolean;
}

export default function Icon({icon, height, onClick, useSuccessIcon}: Props) {
    const [success, setSuccess] = useState(false);

    function handleClick(e: any) {
        if (useSuccessIcon) {
            setSuccess(true);
            setTimeout(() => {
                setSuccess(false);
            }, 1500);
        }
        onClick?.(e);
    }

    return (
        <img style={{height: `${height}rem`}} className={classes.icon}src={`icons/${success ? "success" : icon}.svg`} onClick={handleClick} alt="ikon"/>
    )
}