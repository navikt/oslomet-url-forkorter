import classes from "./dropdownbutton.module.css";
import Icon from "../Icon/Icon.tsx";
import {useEffect, useState} from "react";

interface DropdownOption {
    label: string;
    value: string;
}

interface DropdownButtonProps {
    label?: string;
    options: DropdownOption[];
    changeCallback: (value: string) => void;
}

export default function DropdownButton({ label, options, changeCallback }: DropdownButtonProps) {
    const [value, setValue] = useState(options[0]?.value || "");

    const handleChange = (newValue: string) => {
        setValue(newValue);
        changeCallback(newValue);
    };

    useEffect(() => {
        if (value === "") {
            setValue(options[0]?.value || "");
        }
    }, [options]);

    return (
        <div className={classes.wrapper}>
            {label && <label className={classes.label}>{label}</label>}
            <div className={classes.container}>
                <select
                    className={classes.input}
                    value={value}
                    onChange={(e) => handleChange(e.target.value)}
                >
                    {options.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>
                <div className={classes.icon}>
                    <Icon icon="chevron-down"/>
                </div>
            </div>
        </div>
    );
}
