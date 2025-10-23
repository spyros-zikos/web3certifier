// components/ButtonLink.tsx
import NextLink from "next/link";
import { Button, ButtonProps, Link as ChakraLink } from "@chakra-ui/react";

interface ButtonLinkProps extends ButtonProps {
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
export const ButtonLink = ({ href, isExternal, children, ...props }: ButtonLinkProps) => {
  // External links (e.g., https://...) → regular anchor
  if (isExternal || href.startsWith("http")) {
    return (
      <Button
        as={ChakraLink}
        href={href}
        isExternal
        {...props}
      >
        {children}
      </Button>
    );
  }

  // Internal links → Next.js router
  return (
    <Button as={NextLink} href={href} {...props}>
      {children}
    </Button>
  );
};
