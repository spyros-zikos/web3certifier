import NextLink from "next/link";
// import { ButtonProps } from "@chakra-ui/react";
import Button, { MyButtonProps } from "./Button";

interface ButtonLinkProps extends MyButtonProps {
    href: string;
    isExternal?: boolean;
}

/**
 * ButtonLink - A reusable button that can handle both internal (Next.js) and external links.
 *
 * Usage:
 * <ButtonLink href="/about">Go to About</ButtonLink>
 * <ButtonLink href="https://chakra-ui.com" isExternal>Visit Chakra</ButtonLink>
 */
const ButtonLink = ({ href, isExternal, children, ...props }: ButtonLinkProps) => {
    // External links (e.g., https://...) → regular anchor
    if (isExternal || href.startsWith("http")) {
        return (
            <a href={href} target="_blank" rel="noopener noreferrer">
                <Button {...props}>
                    {children}
                </Button>
            </a>
        );
    }

    // Internal links → Next.js router
    return (
        <NextLink href={href}>
            <Button {...props}>
                {children}
            </Button>
        </NextLink>
    );
};

export default ButtonLink;