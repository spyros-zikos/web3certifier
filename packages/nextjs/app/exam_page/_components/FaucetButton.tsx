import { Box } from '@chakra-ui/react'
import React from 'react'

const FaucetButton = ({
    message, isInitialStatus, handleClaimFaucet
}: {
    message: string, isInitialStatus: boolean, handleClaimFaucet: () => void
}) => {
    return (
        <Box 
            className="mt-2"
            textDecoration={isInitialStatus ? "underline" : "none"}
            display="flex"
            justifyContent="center"
            color="lighterLighterBlack"
            onClick={isInitialStatus ? handleClaimFaucet : undefined}
            cursor={isInitialStatus ? "pointer" : "default"}
        >
            <Box>
                {message}
            </Box>
        </Box>
    )
}

export default FaucetButton