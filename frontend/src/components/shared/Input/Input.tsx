import classes from "./input.module.css"
import Button from "../Button/Button.tsx";
import {CSSProperties} from "react";

interface Props {
    type?: string;
    placeholder?: string;
    buttonText?: string;
    onClick?: () => void;
    onChange?: (value: string) => void;
    disableButton?: boolean;
    style?: CSSProperties;
}

export default function Input({
                                  type = "search",
                                  placeholder,
                                  buttonText = "Søk",
                                  onClick,
                                  onChange,
                                  disableButton,
                                  style
                              }: Props) {
    return (
        <div className={classes.container} style={style}>
            <input
                className={classes.input}
                type={type}
                placeholder={placeholder}
                onChange={(e) => onChange?.(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        onClick?.();
                    }
                }}/>
            {!disableButton && <Button className={classes.button} text={buttonText} onClick={onClick}/>}
        </div>
    )
}