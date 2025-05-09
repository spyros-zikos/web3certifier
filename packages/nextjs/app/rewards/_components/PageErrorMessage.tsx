import React from 'react'

const PageErrorMessage = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="text-3xl font-bold mt-52 mx-auto">
        {children}
    </div>
  )
}

export default PageErrorMessage