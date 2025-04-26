import {CSSProperties} from "react";
import classes from "./Search.module.css";
import Button from "../Button/Button.tsx";

interface Props {
    placeholder?: string;
    onClick?: () => void;
    onChange?: (value: string) => void;
    disableButton?: boolean;
    style?: CSSProperties;
}

export default function Search({placeholder, onClick, onChange, disableButton, style}: Props) {
    return (
        <div className={classes.container} style={style}>
            <input className={classes.input}
                type="search"
                placeholder={placeholder}
                onChange={(e) => onChange?.(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        onClick?.();
                    }
                }}
            />
            {!disableButton && <Button className={classes.button} text="Søk" onClick={onClick}/>}
        </div>
    )
}