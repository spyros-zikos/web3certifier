import React, { FC } from 'react';
import { Button, ButtonProps } from '@chakra-ui/react'

export interface MyButtonProps extends ButtonProps {
    children: any;
    onClick?: any;
    color?: "green" | "black" | "white";  // optional
    bgColor?: "green" | "black" | "white";
    borderColor?: "green" | "black" | "white";  // optional
    hoverColor?: "green" | "black" | "white";  // optional
    hoverBgColor?: "green" | "black" | "white";
    hoverBorderColor?: "green" | "black" | "white";  // optional
}

const colorNameToChakraColor = (color: string) => {
    switch (color) {
        case "green":
            return "green";
        case "black":
            return "black";
        case "white":
            return "neutral";
        default:
            return "green";
    }
}

const MyButton: FC<MyButtonProps> = ({ children, color, bgColor="green", borderColor, hoverColor, hoverBgColor="green", hoverBorderColor, ...props}) => {
    // text will be black when bg is green and black otherwise
    const textColorAttr = bgColor === "green" ? "black" : "green";
    const bgColorAttr = colorNameToChakraColor(bgColor);
    // bg=green -> hoverBg=
    const hoverTextColorAttr = hoverBgColor === "green" ? "black" : "green";
    const hoverBgColorAttr = colorNameToChakraColor(hoverBgColor);
    return (
        <Button 
            my={2} p={2} rounded="rounded-md"
            color={color ? colorNameToChakraColor(color) : textColorAttr}
            bgColor={bgColorAttr}
            borderColor={borderColor ? colorNameToChakraColor(borderColor) : textColorAttr}
            borderWidth="2px" borderRadius={"md"}
            _hover={{
                color: hoverColor ? colorNameToChakraColor(hoverColor) : hoverTextColorAttr,
                bg: hoverBgColorAttr,
                borderColor: hoverBorderColor ? colorNameToChakraColor(hoverBorderColor) : hoverTextColorAttr
            }}
            {...props}
        >
            {children}
        </Button>
    )
}

interface Props2 {
    className?: string;
    children: any;
    onClick: any;
    disabled?: boolean;
    textBorderColor?: string
}
const Button2: FC<Props2> = ({ className = '', children, textBorderColor = 'primary', ...props}) => {
    return (
        <button 
            {...props}
            className={
                `my-2 p-2 border border-${textBorderColor} rounded-md text-${textBorderColor}
                hover:bg-base-200 hover:text-accent hover:border-2 hover:border-accent 
                ${className} `
            }
        >
            {children}
        </button>
    )
}

export default MyButton;
