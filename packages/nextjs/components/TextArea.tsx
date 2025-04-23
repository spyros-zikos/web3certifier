import React, { FC } from 'react';

interface Props {
  className?: string;
  value: any;
  placeholder: any;
  onChange: any;
}

const TextArea: FC<Props> = ({ className = '', ...props }) => {
  return (
    <textarea
      {...props}
      className={
        `w-64 block m-2 p-2 rounded-md
        border border-accent bg-base-200 placeholder-base-300 hover:border-neutral focus:outline-none focus:border-2 focus:border-neutral
        ${className} `
      }
    />
  )
}

export default TextArea;
