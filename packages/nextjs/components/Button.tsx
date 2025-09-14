import React, { FC } from 'react';

interface Props {
  className?: string;
  children: any;
  onClick: any;
  disabled?: boolean;
  textBorderColor?: string
}

const Button: FC<Props> = ({ className = '', children, textBorderColor = 'primary', ...props}) => {
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

export default Button;
