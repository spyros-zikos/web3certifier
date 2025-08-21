import React, { FC } from 'react';

interface Props {
  className?: string;
  title?: string;
  value?: any;
  type?: any;
  placeholder?: any;
  checked?: any;
  onChange: any;
}

const Input: FC<Props> = ({ className = '', ...props }) => {
  return (
    <input
      {...props}
      className={
        `w-[210px] block my-2 p-2
        border border-neutral bg-base-200 placeholder-base-300 rounded-md hover:border-accent focus:outline-none focus:border-2 focus:border-accent
        ${className} `
      }
    />
  )
}

export default Input;
