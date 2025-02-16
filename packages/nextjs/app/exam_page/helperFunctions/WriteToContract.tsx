/*//////////////////////////////////////////////////////////////
                            SUBMIT EXAM
//////////////////////////////////////////////////////////////*/

export const handleSubmitAnswers = async (submitAnswers: any, id: bigint, hashedAnswer: string, examPrice: BigInt) => {
    await submitAnswers(
        {
        functionName: "submitAnswers",
        args: [id, `0x${hashedAnswer?.substring(2)}`], // TODO check that
        value: examPrice
        },
        {
        onBlockConfirmation: (res: any) => {
            console.log("block confirm", res);
            // router.push(`/`);
        },
        },
    );
};

/*//////////////////////////////////////////////////////////////
                            CANCEL EXAM
//////////////////////////////////////////////////////////////*/

export const handleCancelExam = async (cancelExam: any, id: bigint) => {
    try {
        await cancelExam(
            {
            functionName: "cancelUncorrectedExam",
            args: [id],
            },
            {
            onBlockConfirmation: (res: any) => {
                console.log("block confirm", res);
                // router.push(`/`);
            },
            },
        );
    } catch (error) {
        console.log("nft mint error", error);
    }
};

/*//////////////////////////////////////////////////////////////
                            CORRECT EXAM
//////////////////////////////////////////////////////////////*/

export const handleCorrectExam = async (correctExam: any, id: bigint, answers: bigint[]) => {
    try {
        await correctExam(
            {
            functionName: "correctExam",
            args: [id, answers],
            },
            {
            onBlockConfirmation: (res: any) => {
                console.log("block confirm", res);
                // router.push(`/`);
            },
            },
        );
    } catch (error) {
        console.log("nft mint error", error);
    }
};

/*//////////////////////////////////////////////////////////////
                    REFUND UNSUCCESSFUL EXAM
//////////////////////////////////////////////////////////////*/

export const handleRefundExam = async (refundExam: any, id: bigint) => {
    await refundExam(
        {
        functionName: "refundExam",
        args: [id],
        },
        {
        onBlockConfirmation: (res: any) => {
            console.log("block confirm", res);
            // router.push(`/`);
        },
        },
    );
};

/*//////////////////////////////////////////////////////////////
                        CLAIM CERTIFICATE
//////////////////////////////////////////////////////////////*/

export const handleClaimCertificate = async (claimCertificate: any, id: bigint, answersArray: bigint[], key: bigint) => {
    await claimCertificate(
        {
        functionName: "claimCertificate",
        args: [id, answersArray, key],
        },
        {
        onBlockConfirmation: (res: any) => {
            console.log("block confirm", res);
            // router.push(`/`);
        },
        },
    );
};