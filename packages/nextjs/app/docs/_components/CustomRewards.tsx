import React from 'react';
import { Box, Heading } from '@chakra-ui/react';
import Link from 'next/link';

const CustomRewards: React.FC = () => {
    return (
        <div>
            <Heading fontSize="2xl" fontWeight="bold" >&#x1F680; Setting Up Custom Rewards through Foundry Repository</Heading>
            <Box mt="4">Please visit the <Link href={"https://github.com/Web3-Certifier/custom-reward"} target="_blank"><Box textDecoration="underline" display="inline">Foundry repository</Box></Link> for instructions on how to set up custom rewards.</Box>
        </div>
    );
};

export default CustomRewards;