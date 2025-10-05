// hooks
import React, { useEffect, useState } from "react"
import { wagmiReadFromContract } from "~~/hooks/wagmi/wagmiRead";
import { wagmiWriteToContract } from "~~/hooks/wagmi/wagmiWrite";
import { useEngagementRewards, DEV_REWARDS_CONTRACT, REWARDS_CONTRACT } from '@goodsdks/engagement-sdk'
import { useSearchParams } from "next/navigation";
import { usePublicClient, useWalletClient, useBlockNumber } from "wagmi";
// components
import { IndexSelector } from "~~/components/IndexSelector";
import { Question, MessageForUser, SubmitAnswersFaucet } from "../../_components";
import { Box } from "@chakra-ui/react";
import { VerifyAccountMessage, QuestionTimer, ExamStartWarningBox } from "./components";
// functions
import Cookies from 'js-cookie';
import periodicActions from "./functions/periodicActions";
import removeExcessTime from "./functions/removeExcessTime";
import getCurrentTimestamp from "./functions/getCurrentTimestamp";
// constants
import { chainsToContracts, cookieExpirationTime, DEFAULT_USER_ADDRESS, getStartTimeCookieName, timePerQuestion, ZERO_ADDRESS } from "~~/constants";
import onClickSubmitAnswersButton from "./functions/onClickSubmitAnswersButton";


const Page = ({
    id, exam, address, chain
}: {
    id: bigint, exam: Exam | undefined, address: string | undefined, chain: any
}) => {

    /*//////////////////////////////////////////////////////////////
                               USE_STATE
    //////////////////////////////////////////////////////////////*/

    const [questionNumber, setQuestionNumber] = useState<number>(0);
    // const [answers, setAnswers] = useState<bigint[]>(Array(exam?.questions.length).fill(BigInt(0)));
    const [startTime, setStartTime] = useState(0);
    const [timeEnded, setTimeEnded] = useState(false);
    const [userHasAlreadyClaimedFaucetFunds, setUserHasAlreadyClaimedFaucetFunds] = useState(true);

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

    /*//////////////////////////////////////////////////////////////
                               VARIABLES
    //////////////////////////////////////////////////////////////*/

    // Get inviter address
    const searchParams = useSearchParams();
    const inviter = searchParams.get("inviter");
    // For identity sdk
    const publicClient = usePublicClient();
    const { data: walletClient } = useWalletClient();
    // Cookies
    const startTimeCookie = getStartTimeCookieName(chain, id);
    // identity verification
    const needsVerification = !isVerifiedOnCelo && chain?.id === 42220;
    // engagement rewards
    const canClaimEngagementRewards = inviter && chain.id === 42220 && isRegisteredOnEngagementRewards && !isRegisteredOnEngagementRewards[0];
    const engagementRewards = useEngagementRewards(REWARDS_CONTRACT);
    // submit answers hook
    const { writeContractAsync: submitAnswers } = wagmiWriteToContract();
    // block number
    const blockNumber = useBlockNumber({ watch: true, cacheTime: 1000, query: {refetchInterval: 1000, gcTime: 1000} });

    /*//////////////////////////////////////////////////////////////
                              USE_EFFECT
    //////////////////////////////////////////////////////////////*/

    // Check if user can claim from faucet
    useEffect(() => {
        // call the submit_answers faucet api
        fetch(`/api/exam_page/user/submit_answers/faucet/user_has_claimed?chainId=${chain?.id}&examId=${id}&user=${address}`)
        .then(response => response.json())
        .then(data => setUserHasAlreadyClaimedFaucetFunds(data))
    }, [address, id, chain?.id])

    // Periodic actions that are time dependent
    useEffect(() => {
        periodicActions(
            startTime,
            setStartTime,
            questionNumber,
            setTimeEnded,
            setQuestionNumber,
            exam?.questions?.length,
            startTimeCookie
        );
    }, [getCurrentTimestamp()]);

    /*//////////////////////////////////////////////////////////////
                               FUNCTIONS
    //////////////////////////////////////////////////////////////*/

    /// if a user clicks next before the timer of the question goes to 0, the remaining time must be discarded
    /// the way this is done is by making the startTime be sooner by the remaining time
    const onClickNextQuestion = (nextQuestionNumber: number) => {
        // remove excess time
        removeExcessTime(startTime, setStartTime, questionNumber, startTimeCookie);
        // do the default action that changes the questionNumber
        setQuestionNumber(nextQuestionNumber);
    }

    return (
        <>
            {/* Questions */}
            {questionNumber > 0 ?
                // if user has started the exam
                <Question questionNumber={questionNumber} exam={exam} showAnswers={timeEnded ? false : true} />
                :
                // if user has not started the exam
                <ExamStartWarningBox
                    onClickStart={
                        () => {
                            const startTime = getCurrentTimestamp(); 
                            Cookies.set(startTimeCookie, startTime.toString(), { expires: cookieExpirationTime });
                            setQuestionNumber(1);
                        }
                    }
                />
            }

            {/* Timer for each question */}
            <QuestionTimer startTime={startTime} questionNumber={questionNumber} timePerQuestion={timePerQuestion} currentTimestamp={getCurrentTimestamp()} />

            {questionNumber > 0 ? <IndexSelector
                setIndex={onClickNextQuestion}
                index={questionNumber}
                firstIndex={1}
                lastIndex={exam?.questions ? exam?.questions.length : 1}
                submitButtonOnClick={() => onClickSubmitAnswersButton(
                    blockNumber,
                    canClaimEngagementRewards,
                    engagementRewards,
                    chain,
                    inviter,
                    address,
                    exam,
                    examPriceInEth,
                    submitAnswers
                )}
                previousEnabled={false}
            />: <></>}

            {!needsVerification && !userHasAlreadyClaimedFaucetFunds 
            && questionNumber === (exam?.questions.length || 1) 
            && <SubmitAnswersFaucet id={id} user={address} chainId={chain?.id}/>}

            <MessageForUser 
                message={
                    <div>
                        {!needsVerification && canClaimEngagementRewards && <><Box color="green">You are eligible to claim engagement rewards (2k G$ tokens) if you submit your answers to this exam!</Box><br /></>}
                        
                        <Box color="lighterLighterBlack">Note: The system uses cookies to store your password.
                        This means that you can claim your certificate only from this device.</Box>
                        {needsVerification && (address !== DEFAULT_USER_ADDRESS) ? <VerifyAccountMessage publicClient={publicClient} walletClient={walletClient}/> : ""}
                    </div>
                }
            />
        </>
    );
}

export default Page