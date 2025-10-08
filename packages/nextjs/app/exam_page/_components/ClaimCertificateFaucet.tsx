import React, { useState } from 'react'
import FaucetButton from './FaucetButton';

const ClaimCertificateFaucet = ({chainId, id, user}: {chainId: number, id: bigint, user: string | undefined}) => {
    const initialStatus = 1000;
    const [status, setStatus] = useState(initialStatus);
    
    const handleClaimFaucet = async () => {
        if (!id) return;
        if ( !user || !chainId ) {
            setStatus(406);
            return;
        }

        const response = await fetch(`/api/exam_page/user/claim_certificate/faucet/claim/`, {
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
        <FaucetButton
            message={
                status === initialStatus ? "Get funds to cover gas fees" :
                status === 200 ? "Claimed funds successfully!" :
                status === 401 ? "Status is not submitted" :
                status === 402 ? "Already claimed" :
                status === 403 ? "Exam is not featured" :
                status === 406 ? "Connect your wallet" :
                "Faucet failed"
            }
            isInitialStatus={status===initialStatus}
            handleClaimFaucet={handleClaimFaucet}
        />
    )
}

export default ClaimCertificateFaucet