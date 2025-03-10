import {StyledLink} from "./link.style.ts";
import {ReactNode} from "react";

interface LinkProps{
    children: ReactNode;
    href: string;
    target?: string;
    rel?: string;
}

export default function Link({children, href, target, rel}: LinkProps) {

    return (
        <StyledLink href={href} target={target} rel={rel}>
            {children}
        </StyledLink>
    )
}