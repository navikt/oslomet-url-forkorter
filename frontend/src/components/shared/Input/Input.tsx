import classes from "./input.module.css"
import Button from "../Button/Button.tsx";

interface Props {
    placeholder?: string;
    buttonText?: string;
    onClick?: () => void;
    onChange?: (value: string) => void;
}

export default function Input({placeholder, buttonText = "Opprett", onClick, onChange}: Props) {
    return (
        <div className={classes.container}>
            <input className={classes.input} type="search" placeholder={placeholder} onChange={(e) => onChange?.(e.target.value)}/>
            <Button className={classes.button} text={buttonText} onClick={onClick}/>
        </div>
    )
}