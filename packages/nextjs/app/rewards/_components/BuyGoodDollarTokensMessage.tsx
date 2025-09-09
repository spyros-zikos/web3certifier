import { Box } from '@chakra-ui/react'
import Link from 'next/link'
import React from 'react'

const BuyGoodDollarTokensMessage = () => {
  return (
    <Box color="lighterLighterBlack">You can get G$ tokens <Link href="https://gooddapp.org/#/swap/celoReserve"><Box textDecoration="underline" display="inline">here</Box></Link>.</Box>
  )
}

export default BuyGoodDollarTokensMessage