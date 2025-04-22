/*//////////////////////////////////////////////////////////////
                            SUBMIT EXAM
//////////////////////////////////////////////////////////////*/

export const handleSubmitAnswers = async (submitAnswers: any, id: bigint, hashedAnswer: string, examPrice: bigint) => {
    await submitAnswers({
        functionName: "submitAnswers",
        args: [id, `0x${hashedAnswer?.substring(2)}`],
        value: examPrice
    }, {
        onBlockConfirmation: (res: any) => {
            console.log("block confirm", res);
        },
    });
};

/*//////////////////////////////////////////////////////////////
                            CORRECT EXAM
//////////////////////////////////////////////////////////////*/

export const handleCorrectExam = async (correctExam: any, id: bigint, answers: bigint[]) => {
    await correctExam({
        functionName: "correctExam",
        args: [id, answers],
    }, {
        onBlockConfirmation: (res: any) => {
            console.log("block confirm", res);
        },
    });
};

/*//////////////////////////////////////////////////////////////
                    REFUND UNSUCCESSFUL EXAM
//////////////////////////////////////////////////////////////*/

export const handleRefundExam = async (refundExam: any, id: bigint) => {
    await refundExam({
        functionName: "refundExam",
        args: [id],
    }, {
        onBlockConfirmation: (res: any) => {
            console.log("block confirm", res);
        },
    });
};


/*//////////////////////////////////////////////////////////////
                        CLAIM CERTIFICATE
//////////////////////////////////////////////////////////////*/

export const handleClaimCertificate = async (claimCertificate: any, id: bigint, answersArray: bigint[], key: bigint) => {
    await claimCertificate({
        functionName: "claimCertificate",
        args: [id, answersArray, key],
    }, {
        onBlockConfirmation: (res: any) => {
            console.log("block confirm", res);
        },
    });
};
