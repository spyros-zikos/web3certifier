import React from 'react'
import { Button } from '~~/components'

const ClaimButton = ({text, onClick}: {text: string, onClick: any}) => {
  return (
    <Button className="mt-8 ml-[25%] w-[50%] bg-base-100" onClick={onClick}>
        {text}
    </Button>
  )
}

export default ClaimButton