import React from 'react'

const SubHeading = ({ children }: { children: React.ReactNode }) => {
  return (
        <div className="text-2xl font-bold mt-9">{children}</div>
    );
}

export default SubHeading