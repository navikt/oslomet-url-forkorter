import {ReactNode} from "react";
import classes from "./link.module.css";

interface LinkProps{
    children: ReactNode;
    href: string;
    target?: string;
    onClick?: (e: any) => unknown;
    rel?: string;
}

export default function Link({children, href, target, onClick, rel}: LinkProps) {

    return (
        <a onClick={onClick} className={classes.link} href={href} target={target} rel={rel}>
            {children}
        </a>
    )
}