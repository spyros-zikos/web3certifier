import React from 'react'

const InputLabel = ({ children }: { children: React.ReactNode }) => {
    if (children == '' || children == undefined || children == null)
        return null;

    return (
        <label className="mt-4 block">{children}</label>
    )
}

export default InputLabel