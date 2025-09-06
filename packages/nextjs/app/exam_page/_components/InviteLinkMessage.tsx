import { Box, Button } from '@chakra-ui/react';
import React, { useState } from 'react'

const InviteLinkMessage = ({ id, address }: { id: bigint, address: string }) => {
    const [inviterLinkCopyButtonText, setInviterLinkCopyButtonText] = useState("Copy");

    return (
        <Box fontSize="sm" mt="8" border="2px" borderStyle="solid" borderColor="lightGreen" rounded="lg" p="4" bg="green.50">
            <Box fontWeight="bold" mb="2" color="green">🎯 Earn 3,000 G$ Tokens!</Box>
            <Box mb="3">Share this exam and earn rewards for every participant who submits using your referral link.</Box>
            <Box display="flex" alignItems="center" gap="2" p="2" rounded="md" border="1px solid" borderColor="lightGreen">
                <Box flex="1" fontFamily="mono" fontSize="xs" wordBreak="break-all">
                    https://web3certifier.com/exam_page?id=${id.toString()}&inviter=${address}
                </Box>
                <Button size="xs" colorScheme="green" onClick={async () => {
                    navigator.clipboard.writeText(`https://web3certifier.com/exam_page?id=${id}&inviter=${address}`);
                    setInviterLinkCopyButtonText("Done!");
                    await new Promise(resolve => setTimeout(resolve, 3000));
                    setInviterLinkCopyButtonText("Copy");
                }}>
                    {inviterLinkCopyButtonText}
                </Button>
            </Box>
        </Box>
    )
}

export default InviteLinkMessage