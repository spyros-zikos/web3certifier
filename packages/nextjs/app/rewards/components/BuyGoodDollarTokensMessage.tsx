import { Box } from '@chakra-ui/react'
import Link from 'next/link'
import React from 'react'

const BuyGoodDollarTokensMessage = () => {
    return (
        <Box mt="6" bg="darkGreen" border="2px" borderColor="lightGreen" p="1" px="2" w="fit" rounded="md">
            <Box color="lighterLighterBlack">You can get G$ tokens <Link href="https://gooddapp.org/#/swap/celoReserve"><Box textDecoration="underline" display="inline">here</Box></Link>.</Box>
        </Box>
    )
}

export default BuyGoodDollarTokensMessage