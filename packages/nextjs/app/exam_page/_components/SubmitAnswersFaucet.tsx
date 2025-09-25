import React, { useState } from 'react'
import { Box } from '@chakra-ui/react'

const SubmitAnswersFaucet = ({chainId, id, user}: {chainId: number, id: bigint, user: string | undefined}) => {
    const initialStatus = 1000;
    const [status, setStatus] = useState(initialStatus);
    
    const handleFaucet = async () => {
        if (!id) return;
        if ( !user || !chainId ) {
            setStatus(403);
            return;
        }

        const response = await fetch(`/api/exam_page/user/submit_answers/faucet/claim/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ chainId: chainId.toString(), examId: id.toString(), user }),
        });
        const data = await response.json();
        const status = response.status;
        console.log(status);
        console.log(data);

        setStatus(status);
    }

    return (
        <Box 
            className="mt-2 ml-[50%] w-[50%]"
            textDecoration={status === initialStatus ? "underline" : "none"}
            display="flex"
            justifyContent="center"
            color="lighterLighterBlack"
            onClick={status === initialStatus ? handleFaucet : undefined}
            cursor={status === initialStatus ? "pointer" : "default"}
        >
            <Box>
                {status === initialStatus ? <>Get funds to cover gas fees</> :
                status === 200 ? <>Claimed funds successfully!</> :
                status === 401 ? <>Not verified</> :
                status === 402 ? <>Already claimed</> :
                status === 403 ? <>Connect your wallet</> :
                <>Faucet failed</>}
            </Box>
        </Box>
    )
}

export default SubmitAnswersFaucet