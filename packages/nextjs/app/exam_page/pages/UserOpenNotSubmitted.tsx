import React, { useEffect, useState } from "react"
import { wagmiReadFromContract } from "~~/hooks/wagmi/wagmiRead";
import { IndexSelector } from "~~/components/IndexSelector";
import { getHashedAnswerAndMessageWithCookies, keyLength } from "../helperFunctions/PasswordManagement";
import Cookies from 'js-cookie';
import { handleSubmitAnswers } from "../helperFunctions/Handlers";
import { wagmiWriteToContract } from "~~/hooks/wagmi/wagmiWrite";
import { Question, MessageForUser, ExamStartWarningBox, SubmitAnswersFaucet } from "../_components";
import { Box } from "@chakra-ui/react";
import { chainsToContracts, cookieExpirationTime, getLastSubmitterAddressCookieName, getPasswordCookieName, getStartTimeCookieName, timePerQuestion, ZERO_ADDRESS } from "~~/constants";
import { useEngagementRewards, DEV_REWARDS_CONTRACT, REWARDS_CONTRACT } from '@goodsdks/engagement-sdk'
import { useSearchParams } from "next/navigation";
import { wagmiReadFromContractAsync } from "~~/utils/wagmi/wagmiReadAsync";
import { IdentitySDK } from '@goodsdks/citizen-sdk';
import { usePublicClient, useWalletClient } from "wagmi";


const UserOpenNotSubmitted = ({
    id, exam, address, chain, userStatus
}: {
    id: bigint, exam: Exam | undefined, address: string | undefined, chain: any, userStatus: number
}) => {
    const [questionNumber, setQuestionNumber] = useState<number>(0);
    const [answers, setAnswers] = useState<bigint[]>(Array(exam?.questions.length).fill(BigInt(0)));
    const [randomKey, _] = useState(Math.floor((10**keyLength) * Math.random()));
    const [startTime, setStartTime] = useState(0);
    const [timeEnded, setTimeEnded] = useState(false);
    const [userHasAlreadyClaimedFaucetFunds, setUserHasAlreadyClaimedFaucetFunds] = useState(true);
    const searchParams = useSearchParams();
    const inviter = searchParams.get("inviter");
    // For identity sdk
    const publicClient = usePublicClient();
    const { data: walletClient } = useWalletClient();

    const passwordCookie = getPasswordCookieName(chain, id, address);
    const startTimeCookie = getStartTimeCookieName(chain, id);
    // if the last address is not undefined
    // then someone already submitted from the browser successfully
    const lastSubmitterAddressCookie = getLastSubmitterAddressCookieName(chain, id);

    // Faucet
    useEffect(() => {
        // call the api api/user/claim_certificate/faucet/user_has_claimed
        fetch(`/api/user/submit_answers/faucet/user_has_claimed?chainId=${chain?.id}&examId=${id}&user=${address}`)
        .then(response => response.json())
        .then(data => setUserHasAlreadyClaimedFaucetFunds(data))
    }, [address, id, chain?.id])

    /*//////////////////////////////////////////////////////////////
                          READ FROM CONTRACT
    //////////////////////////////////////////////////////////////*/

    const isVerifiedOnCelo: boolean = wagmiReadFromContract({
        functionName: "getIsVerifiedOnCelo",
        args: [address],
    }).data;
    
    const examPriceInEth = wagmiReadFromContract({
        functionName: "getUsdToEthRate",
        args: [BigInt(exam ? exam.price.toString() : 0)],
    }).data;

    // the [0] field is the isRegistered field which is a uint32 timestamp of the time the user first claimed
    const isRegisteredOnEngagementRewards = chain?.id === 42220 ? wagmiReadFromContract({
        contractName: "EngagementRewards",
        functionName: "userRegistrations",
        args: [chainsToContracts[chain?.id]["Certifier"].address, address],
    }).data
    : 0;

    const needsVerification = !isVerifiedOnCelo && chain?.id === 42220;
    const [hashedAnswerToSubmit, userPassword] = getHashedAnswerAndMessageWithCookies(answers, randomKey, address);
    const canClaimEngagementRewards = inviter && chain.id === 42220 && isRegisteredOnEngagementRewards && !isRegisteredOnEngagementRewards[0];

    const { writeContractAsync: submitAnswers, success: submitAnswersSuccess } = wagmiWriteToContract();
    const engagementRewards = useEngagementRewards(REWARDS_CONTRACT);

    useEffect(() => {
        if (submitAnswersSuccess) {
            Cookies.set(lastSubmitterAddressCookie || "", address || "", { expires: cookieExpirationTime });
            Cookies.set(passwordCookie || "", userPassword || "", { expires: cookieExpirationTime });
        }
    }, [submitAnswersSuccess]);

    const onClickSubmitAnswersButton = async () => {
        const currentBlock = await engagementRewards?.getCurrentBlockNumber();
        const validUntilBlock = (currentBlock || 1000000000n) + 50n // Valid for 10 blocks
        
        try {
            let signature = "0x";
            if (canClaimEngagementRewards)
                signature = await engagementRewards?.signClaim(
                    chainsToContracts[chain?.id]["Certifier"].address,
                    inviter || ZERO_ADDRESS,
                    validUntilBlock
                ) as any;
                
            console.log("id, hashedAnswer, examPrice, inviter, validUntilBlock, signature:",
                id, hashedAnswerToSubmit, examPriceInEth, inviter, validUntilBlock, signature);
                
            console.log(userPassword);

            // testnet is very slow and the success varible does not work properly. so you dont do that:
            if (chain.id === 11155111) {
                Cookies.set(lastSubmitterAddressCookie || "", address || "", { expires: cookieExpirationTime });
                Cookies.set(passwordCookie || "", userPassword || "", { expires: cookieExpirationTime });
            }

            if (hashedAnswerToSubmit && exam && (exam.price > 0 ? examPriceInEth : true) && answers.length === exam?.questions?.length)
                handleSubmitAnswers(submitAnswers, id, hashedAnswerToSubmit, examPriceInEth!, inviter || ZERO_ADDRESS, validUntilBlock, signature);
        } catch (error) {
            console.log(error);
        }
    }

    const handleVerifyClick = async () => {
        try {
            if (!publicClient || !walletClient) {
                console.error("Clients not available");
                return;
            }
            const identitySDK = await IdentitySDK.init({
                publicClient: publicClient,
                walletClient: walletClient,
                env: "production" // or "staging" or "development"
            });
            
            const fvLink = await identitySDK.generateFVLink(false, window.location.href);
            window.open(fvLink);
        } catch (error) {
            console.error("Failed to generate FV link:", error);
        }
    };

    const VerifyAccountMessage = () => {
        return <div>
            {"\n"}To prevent multiple submissions from the same person, please&nbsp;
            <Box display="inline" onClick={handleVerifyClick} fontStyle="italic" textDecoration="underline" cursor="pointer">
                verify that this account belongs to a unique person</Box> in order to be able to submit!
        </div>
    }

    /// timer for each question ///

    const getCurrentTimestamp = () => {
        return Math.floor(Date.now()/1000);
    }
    
    useEffect(() => {
        if (startTime === 0) setStartTime(Number(Cookies.get(startTimeCookie)) || 0);
    
        const unboundQuestionNumber = Math.floor((getCurrentTimestamp() - startTime) / timePerQuestion) + 1;
        if (unboundQuestionNumber > (exam?.questions.length || 1)) {
            setTimeEnded(true);
        } else {
            setTimeEnded(false);
        }

        const boundedQuestionNumber = Math.min(unboundQuestionNumber, exam?.questions.length || 1);
        if (startTime > 0) setQuestionNumber(Math.max(boundedQuestionNumber, questionNumber));
        // console.log(getCurrentTimestamp() - startTime);

        // Also check if user has submitted
        (async () => {
            const userStatus = await wagmiReadFromContractAsync({
                functionName: "getUserStatus",
                args: [address, BigInt(id)],
                chainId: chain?.id
            }) as any;
            
            if (userStatus !== 0) {
                window.location.reload();
            }
        })();
    }, [getCurrentTimestamp()]);

    /// if a user clicks next before the timer of the question goes to 0, the remaining time must be discarded
    /// the way this is done is by making the startTime be sooner by the remaining time
    const handleNextQuestion = (nextQuestionNumber: number) => {
        // calculate remaining time
        const timeRemainingForPreviousQuestion = Math.max(0, startTime + (questionNumber * timePerQuestion) - getCurrentTimestamp());
        // new startTime
        const newStartTime = startTime - timeRemainingForPreviousQuestion;
        // update the variable startTime
        setStartTime(newStartTime);
        // update the cookie startTime
        Cookies.set(startTimeCookie, newStartTime.toString(), { expires: cookieExpirationTime });
        // do the default action that changes the questionNumber
        setQuestionNumber(nextQuestionNumber);
    }

    return (
        <>
            {/* Questions */}
            {questionNumber > 0 ?
                // if user has started the exam
                <Question questionNumber={questionNumber} exam={exam} showAnswers={timeEnded ? false : true} answers={answers} setAnswers={setAnswers} />
                :
                // if user has not started the exam
                <ExamStartWarningBox
                    onClickStart={() => {
                        const startTime = getCurrentTimestamp(); 
                        Cookies.set(startTimeCookie, startTime.toString(), { expires: cookieExpirationTime });
                        setQuestionNumber(1);
                    }}
                />
            }

            {/* Timer for each question */}
            {startTime > 0 &&
            <Box>Time left: &nbsp;
                {Math.max(0, startTime + (questionNumber * timePerQuestion) - getCurrentTimestamp())}
            </Box>}

            {questionNumber > 0 ? <IndexSelector
                setIndex={handleNextQuestion}
                index={questionNumber}
                firstIndex={1}
                lastIndex={exam?.questions ? exam?.questions.length : 1}
                submitButtonOnClick={userStatus === 0 && !Cookies.get(lastSubmitterAddressCookie) ? onClickSubmitAnswersButton : undefined}
                previousEnabled={false}
            />: <></>}

            <MessageForUser 
                message={
                    <div>
                        {canClaimEngagementRewards && <Box color="green">You are eligible to claim engagement rewards (2k G$ tokens) if you submit your answers to this exam!</Box>}
                        <br />
                        <Box color="lighterLighterBlack">Note: The system uses cookies to store your password.
                        This means that you can claim your certificate only from this device.</Box>
                        {needsVerification ? <VerifyAccountMessage /> : ""}
                    </div>
                }
            />

            {!needsVerification && !userHasAlreadyClaimedFaucetFunds && <SubmitAnswersFaucet id={id} user={address} chainId={chain?.id}/>}
            
        </>
    );
}

export default UserOpenNotSubmitted