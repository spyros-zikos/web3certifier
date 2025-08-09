import React, { useState } from "react"
import { IndexSelector } from "~~/components/IndexSelector";
import { handleClaimCertificate } from "../helperFunctions/Handlers";
import { wagmiWriteToContract } from "~~/hooks/wagmi/wagmiWrite";
import { Question, MessageForUser, ClaimButton } from "../_components";
import Cookies from 'js-cookie';
import { getVariablesFromCookies } from "../helperFunctions/PasswordManagement";
import { wagmiReadFromContract } from "~~/hooks/wagmi/wagmiRead";
import { Box } from "@chakra-ui/react";

const UserCorrectedClaimCertificate = ({
    id, exam, address, chain
}: {
    id: bigint, exam: Exam | undefined, address: string | undefined, chain: any
}) => {
    const [questionNumber, setQuestionNumber] = useState<number>(1);

    const userHashedAnswer = wagmiReadFromContract({
        functionName: "getUserHashedAnswer",
        args: [address, id],
    }).data;
    
    const passwordCookie = Cookies.get(`w3c.${chain?.id}.${id}.${address}`);
    const [key, userAnswers, passwordHashGood] = getVariablesFromCookies(passwordCookie || "", address, userHashedAnswer);

    const { writeContractAsync: claimCertificate } = wagmiWriteToContract();
    const onClickClaimCertificateButton = () => {
        passwordCookie && handleClaimCertificate(claimCertificate, id, userAnswers, BigInt(key))
    }

    return (
        <>
            {/* Questions */}
            <Question questionNumber={questionNumber} exam={exam} showAnswers={false} />

            <IndexSelector
                setIndex={setQuestionNumber}
                index={questionNumber}
                firstIndex={1}
                lastIndex={exam?.questions ? exam?.questions.length : 1}
            />

            <MessageForUser
                message={<div>{passwordHashGood? <><Box>Claim your certificate!</Box></> : "Cookie not found!"}</div>}
            />

            {passwordHashGood && <ClaimButton text="Claim Certificate" onClick={onClickClaimCertificateButton}/>}
        </>
    );
}

export default UserCorrectedClaimCertificate