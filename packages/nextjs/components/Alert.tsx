import React, { FC } from "react";

interface Props {
  message: string;
  className?: string;
  type: "success" | "error" | "warning" | "info";
  onClick?: () => void;
}

const Alert: FC<Props> = ({ message, type, onClick, className = "" }) => {
  const options = {
    class: {
      warning: "alert alert-warning",
      error: "alert alert-error",
      info: "alert",
      success: "alert alert-success",
    },
    warning:
      "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z",
    success: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
    error: "M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z",
    info: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
  };
  return (
    <div role="alert" className={options.class[type] + " " + className} onClick={onClick}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="stroke-current shrink-0 h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={options[type]} />
      </svg>
      <span>{message}</span>
    </div>
  );
};

export default Alert;