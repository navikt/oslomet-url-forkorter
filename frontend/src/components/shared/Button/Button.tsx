import classes from "./button.module.css"
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner.tsx";

interface Props {
    text: string;
    onClick?: () => void;
    loading?: boolean;
    className?: string;
}

export default function Button({text, onClick, loading, className}: Props) {
    return (
        <button onClick={onClick} className={`${classes.button} ${className ? className : ""}`} disabled={loading}>
            {loading ? <LoadingSpinner/> : text}
        </button>
    )
}