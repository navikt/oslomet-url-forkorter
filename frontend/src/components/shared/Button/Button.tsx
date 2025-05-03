import classes from "./button.module.css"
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner.tsx";

interface Props {
    text: string;
    onClick?: () => void;
    loading?: boolean;
    disabled?: boolean;
    className?: string;
}

export default function Button({text, onClick, loading, disabled, className}: Props) {
    return (
        <button onClick={disabled ? undefined : onClick}
                className={`${classes.button} ${className ? className : ""}`}
                disabled={loading || disabled}>
            {loading ? <LoadingSpinner/> : text}
        </button>
    )
}