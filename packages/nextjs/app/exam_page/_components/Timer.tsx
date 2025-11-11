import { Flex, Text, chakra } from '@chakra-ui/react'
import React from 'react'

const Timer = ({message, timeLeft, bgColor="black"}: {message: string, timeLeft: string, bgColor?: string}) => {
  return (
    <Text bg={bgColor} pt="1" pb="1px" px="6" borderRadius="xl">
        <Flex >
            <chakra.svg xmlns="http://www.w3.org/2000/svg" mt="19px" mr="2" width="5" height="5" viewBox="0 0 24 24" fill="none" stroke="green" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 15 15"></polyline></chakra.svg>
            <Text fontWeight="semibold">{message}</Text>
        </Flex>
        <Text w="max" mt='0' mx="auto" pl="0" pr="4" fontSize="2xl" fontWeight="bold" color="green">{timeLeft}</Text>
    </Text>
  )
}

export default Timer