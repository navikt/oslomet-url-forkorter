import classes from "./input.module.css"
import Button from "../Button/Button.tsx";
import {CSSProperties, useId} from "react";
import Icon from "../Icon/Icon.tsx";

interface Props {
    label?: string,
    type?: string;
    placeholder?: string;
    buttonText?: string;
    onClick?: () => void;
    onChange?: (value: string) => void;
    disabled?: boolean;
    disableButton?: boolean;
    statusIcon?: string;
    style?: CSSProperties;
}

export default function Input({
                                  label,
                                  type = "search",
                                  placeholder,
                                  buttonText = "Søk",
                                  onClick,
                                  onChange,
                                  disabled,
                                  disableButton,
                                  statusIcon,
                                  style
                              }: Props) {
    const inputId = useId();
    return (
        <div className={classes.wrapper} style={style}>
            {label && (
                <label htmlFor={inputId} className={classes.label}>
                    {label}
                </label>
            )}
            <div className={classes.container} style={style}>
                <input
                    id={inputId}
                    className={`${classes.input} ${disabled && classes.disabled}`}
                    type={type}
                    placeholder={placeholder}
                    disabled={disabled}
                    onChange={(e) => onChange?.(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            onClick?.();
                        }
                    }}/>
                {statusIcon && (
                    <div className={classes.statusIcon}>
                        <Icon icon={statusIcon} />
                    </div>
                )}
                {!disableButton && <Button className={classes.button} text={buttonText} onClick={onClick}/>}
            </div>
        </div>
    )
}