import { Box, Text } from '@chakra-ui/react'
import React from 'react'

const MessageForUser = ({message}: {message: any}) => {
    return (
        <>
            <Box mt="8" display="block"></Box>
            <Text borderTop="1px solid" borderColor="lighterLighterBlack"></Text>
            <Box whiteSpace={"pre-wrap"}>{message}</Box>
        </>
    )
}

export default MessageForUser