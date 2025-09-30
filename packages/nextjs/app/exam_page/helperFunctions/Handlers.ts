/*//////////////////////////////////////////////////////////////
                            SUBMIT EXAM
//////////////////////////////////////////////////////////////*/

export const handleSubmitAnswers = async (submitAnswers: any, id: bigint, hashedAnswer: string, examPrice: bigint, inviter: string, validUntilBlock: bigint, signature: string) => {
    submitAnswers({
        functionName: 'submitAnswers',
        args: [id, `0x${hashedAnswer?.substring(2)}`, inviter, validUntilBlock, `0x${signature?.substring(2)}`],
        value: examPrice,
        gas: 1000000n
    });
};

/*//////////////////////////////////////////////////////////////
                            CORRECT EXAM
//////////////////////////////////////////////////////////////*/

export const handleCorrectExam = async (correctExam: any, id: bigint, answers: string) => {
    correctExam({
        functionName: 'correctExam',
        args: [id, answers],
    });
};

/*//////////////////////////////////////////////////////////////
                    REFUND UNSUCCESSFUL EXAM
//////////////////////////////////////////////////////////////*/

export const handleRefundExam = async (refundExam: any, id: bigint) => {
    refundExam({
        functionName: 'refundExam',
        args: [id],
    });
};

/*//////////////////////////////////////////////////////////////
                        CLAIM CERTIFICATE
//////////////////////////////////////////////////////////////*/

export const handleClaimCertificate = async (claimCertificate: any, id: bigint, answers: string, key: bigint) => {
    claimCertificate({
        functionName: 'claimCertificate',
        args: [id, answers, key],
    });
};

/*//////////////////////////////////////////////////////////////
                        CLAIM REWARD
//////////////////////////////////////////////////////////////*/

export const handleClaimReward = async (claimReward: any, rewardAddress: string) => {
    claimReward({
        contractName: 'Reward',
        contractAddress: rewardAddress,
        functionName: 'claim',
    });
};
