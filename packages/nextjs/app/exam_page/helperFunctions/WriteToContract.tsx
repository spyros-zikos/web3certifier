/*//////////////////////////////////////////////////////////////
                        CLAIM CERTIFICATE
//////////////////////////////////////////////////////////////*/

// export const handleClaimCertificate = async (id: bigint, answers: bigint[], secretNumber: bigint) => {
//     console.log("Exam refund begun");
//     await claimCertificate(
//         {
//         functionName: "claimCertificate",
//         args: [id, answers, secretNumber],
//         },
//         {
//         onBlockConfirmation: res => {
//             console.log("block confirm", res);
//             // router.push(`/`);
//         },
//         },
//     );
// };

/*//////////////////////////////////////////////////////////////
                            SUBMIT EXAM
//////////////////////////////////////////////////////////////*/

export const handlesubmitAnswers = async (submitAnswers: any, hashedAnswer: string, id: bigint) => {
    console.log("Exam submission begun");
    await submitAnswers(
        {
        functionName: "submitAnswers",
        args: [`0x${hashedAnswer?.substring(2)}`, id], // TODO check that
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
                    REFUND UNSUCCESSFUL EXAM
//////////////////////////////////////////////////////////////*/

export const handleRefundExam = async (refundExam: any, id: bigint) => {
    console.log("Exam refund begun");
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
                            CANCEL EXAM
//////////////////////////////////////////////////////////////*/

export const handleCancelExam = async (cancelExam: any, id: bigint) => {
    console.log("Exam cancelation begun");
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
    console.log("Exam correction begun");
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