import React, { FC } from 'react';
import { Button, ButtonProps } from '@chakra-ui/react'

export interface MyButtonProps extends ButtonProps {
    children: any;
    onClick?: any;
    bgColor?: "green" | "black" | "white";
    hoverBgColor?: "green" | "black" | "white";
}

const MyButton: FC<MyButtonProps> = ({ children, bgColor="green", hoverBgColor="green", ...props}) => {
    // text will be black when bg is green and black otherwise
    const textColorAttr = bgColor === "green" ? "black" : "green";
    const bgColorAttr = bgColor === "white" ? "neutral" : bgColor === "black" ? "black" : "green";
    // bg=green -> hoverBg=
    const hoverTextColorAttr = hoverBgColor === "green" ? "black" : "green";
    const hoverBgColorAttr = hoverBgColor === "white" ? "neutral" : hoverBgColor === "black" ? "black" : "green";
    return (
        <Button 
            my={2} p={2} rounded="rounded-md"
            color={textColorAttr} borderColor={textColorAttr} bgColor={bgColorAttr}
            borderWidth="2px" borderRadius={"md"}
            _hover={{
                bg: hoverBgColorAttr,
                color: hoverTextColorAttr,
                borderColor: hoverTextColorAttr
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
