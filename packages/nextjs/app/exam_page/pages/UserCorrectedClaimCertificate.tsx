import React, { useEffect, useState } from "react"
import { IndexSelector } from "~~/components/IndexSelector";
import { handleClaimCertificate } from "../helperFunctions/Handlers";
import { wagmiWriteToContract } from "~~/hooks/wagmi/wagmiWrite";
import { Question, MessageForUser, ClaimButton, ClaimCertificateFaucet } from "../_components";
import Cookies from 'js-cookie';
import { getVariablesFromPasswordCookie } from "../helperFunctions/PasswordManagement";
import { wagmiReadFromContract } from "~~/hooks/wagmi/wagmiRead";
import { Box } from "@chakra-ui/react";
import { getPasswordCookieName } from "~~/constants";
import Link from "next/link";

const UserCorrectedClaimCertificate = ({
    id, exam, address, chain
}: {
    id: bigint, exam: Exam | undefined, address: string | undefined, chain: any
}) => {
    const [questionNumber, setQuestionNumber] = useState<number>(1);
    const [userHasAlreadyClaimedFaucetFunds, setUserHasAlreadyClaimedFaucetFunds] = useState<boolean>(true);

    const userHashedAnswer = wagmiReadFromContract({
        functionName: "getUserHashedAnswer",
        args: [address, id],
    }).data;
    
    const passwordCookie = Cookies.get(getPasswordCookieName(chain, id, address));
    const [key, userAnswers, passwordHashGood] = getVariablesFromPasswordCookie(passwordCookie || "", address, userHashedAnswer);

    const { writeContractAsync: claimCertificate } = wagmiWriteToContract();
    const onClickClaimCertificateButton = () => {
        return passwordCookie && handleClaimCertificate(claimCertificate, id, userAnswers, BigInt(key))
    }

    useEffect(() => {
        // call the api api/user/claim_certificate/faucet/user_has_claimed
        fetch(`/api/user/claim_certificate/faucet/user_has_claimed?chainId=${chain?.id}&examId=${id}&user=${address}`)
        .then(response => response.json())
        .then(data => setUserHasAlreadyClaimedFaucetFunds(data))
    }, [address, id, chain?.id])

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
                message={<div>{passwordHashGood? <><Box>Claim your certificate!</Box></> : <><Box display="inline">Cookie not found! Please use the browser that you used to submit the exam. If you are still having issues, get support at our </Box><Box display="inline" textDecoration={"underline"}><Link href="https://discord.gg/4rXWFNGmDJ">Discord server</Link></Box>.</>}</div>}
            />

            {passwordHashGood && <ClaimButton text="Claim Certificate" onClick={onClickClaimCertificateButton}/>}
            {passwordHashGood && !userHasAlreadyClaimedFaucetFunds && <ClaimCertificateFaucet id={id} user={address} chainId={chain?.id}/>}
        </>
    );
}

export default UserCorrectedClaimCertificate