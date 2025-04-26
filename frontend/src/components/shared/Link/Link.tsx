import {ReactNode} from "react";
import classes from "./link.module.css";

interface LinkProps{
    children: ReactNode;
    href: string;
    target?: string;
    rel?: string;
}

export default function Link({children, href, target, rel}: LinkProps) {

    return (
        <a className={classes.link} href={href} target={target} rel={rel}>
            {children}
        </a>
    )
}