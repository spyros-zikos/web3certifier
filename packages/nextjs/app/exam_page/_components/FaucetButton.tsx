import { Box } from '@chakra-ui/react'
import { Button } from '~~/components'
import { CurrencyDollarIcon } from "@heroicons/react/24/outline";

const FaucetButton = ({
    message, isInitialStatus, disabled, handleClaimFaucet
}: {
    message: string, isInitialStatus: boolean, disabled: boolean, handleClaimFaucet: () => void
}) => {
    return (
        <Box display="flex" justifyContent="center">
            {isInitialStatus
                ? <Button gap="1" fontSize="sm" p="1" h="6" bgColor="black" onClick={handleClaimFaucet} disabled={disabled}>
                    <CurrencyDollarIcon className="h-[22px] w-[22px]" />
                    Gas Faucet
                    <CurrencyDollarIcon className="h-[22px] w-[22px]" />
                </Button>
                : <Box className="mt-2"display="flex"justifyContent="center"color="lighterLighterBlack">
                    {message}
                </Box>
            }
        </Box>
    )
}

export default FaucetButton