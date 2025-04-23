import React, { FC } from 'react';

interface Props {
  className?: string;
  children: any;
  onClick: any;
  disabled?: boolean;
}

const Button: FC<Props> = ({ className = '', children, ...props }) => {
  return (
    <button 
      {...props}
      className={
        `m-2 p-2 border border-primary rounded-md text-primary
        hover:bg-base-200 hover:text-accent hover:border-2 hover:border-accent 
        ${className} `
      }
    >
      {children}
    </button>
  )
}

export default Button;
