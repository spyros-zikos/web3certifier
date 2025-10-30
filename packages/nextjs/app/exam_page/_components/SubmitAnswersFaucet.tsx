import React, { useState } from 'react'
import { Box } from '@chakra-ui/react'
import FaucetButton from './FaucetButton';

const SubmitAnswersFaucet = ({chainId, id, user}: {chainId: number, id: bigint, user: string | undefined}) => {
    const initialStatus = 1000;
    const [status, setStatus] = useState(initialStatus);
    const [buttonClicked, setButtonClicked] = useState(false);
    
    const handleClaimFaucet = async () => {
        if (!id) return;
        if ( !user || !chainId ) {
            setStatus(406);
            return;
        }
        setButtonClicked(true);
        
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
        <Box display={"flex"} justifyContent="right">
            <FaucetButton
                message={
                    status === 200 ? "Claimed funds successfully!" :
                    status === 401 ? "Not verified" :
                    status === 402 ? "Already claimed" :
                    status === 403 ? "Exam is not featured" :
                    status === 406 ? "Connect your wallet" :
                    "Faucet failed"
                }
                isInitialStatus={status===initialStatus}
                disabled={buttonClicked}
                handleClaimFaucet={handleClaimFaucet}
            />
        </Box>
    )
}

export default SubmitAnswersFaucet