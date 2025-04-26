import classes from "./button.module.css"

interface Props {
    text: string;
    onClick?: () => void;
    className?: string;
}

export default function Button({text, onClick, className}: Props) {
    return (
        <button onClick={onClick} className={`${classes.button} ${className}`}>
            {text}
        </button>
    )
}