import React, { FC } from 'react';

interface Props {
  className?: string;
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
        `w-[210px] block m-2 p-2
        border border-accent bg-base-200 placeholder-base-300 rounded-md hover:border-neutral focus:outline-none focus:border-2 focus:border-neutral
        ${className} `
      }
    />
  )
}

export default Input;
