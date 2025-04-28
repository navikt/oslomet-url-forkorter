import classes from "./segmentedbutton.module.css";
import {CSSProperties} from "react";

interface Option {
    label: string;
    value: string;
}

interface Props {
    label?: string;
    options: Option[];
    selectedValue: string;
    onChange: (value: string) => void;
    style?: CSSProperties;
    className?: string;
}

export default function SegmentedButton({
                                            label,
                                            options,
                                            selectedValue,
                                            onChange,
                                            style,
                                            className,
                                        }: Props) {
    return (
        <div className={classes.wrapper} style={style}>
            {label && <div className={classes.label}>{label}</div>}
            <div className={`${classes.container} ${className ?? ""}`} style={style}>
                {options.map((option) => (
                    <button
                        key={option.value}
                        className={`${classes.segment} ${selectedValue === option.value ? classes.selected : ""}`}
                        onClick={() => onChange(option.value)}
                    >
                        {option.label}
                    </button>
                ))}
            </div>
        </div>
    );
}
