import React from 'react'
import { Button } from '~~/components'

const ClaimButton = ({text, onClick}: {text: string, onClick: any}) => {
  return (
    <Button display="inline-block" mt="8" className="ml-[25%] w-[50%]" onClick={onClick}>
        {text}
    </Button>
  )
}

export default ClaimButton