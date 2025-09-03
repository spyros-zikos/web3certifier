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

    // the [0] field is the isRegistered field which is a uint32 timestamp
    const isRegisteredOnEngagementRewards = chain?.id === 42220 ? wagmiReadFromContract({
        contractName: "EngagementRewards",
        functionName: "userRegistrations",
        args: [chainsToContracts[chain?.id]["Certifier"].address, address],
    })?.data[0]
    : 0;

    const needsVerification = !isVerifiedOnCelo && chain?.id === 42220;
    const [hashedAnswerToSubmit, userPassword] = getHashedAnswerAndMessageWithCookies(answers, randomKey, address);

    const { writeContractAsync: submitAnswers, success: submitAnswersSuccess } = wagmiWriteToContract();
    const engagementRewards = useEngagementRewards(REWARDS_CONTRACT);

    useEffect(() => {
        if (submitAnswersSuccess) {
            Cookies.set(lastSubmitterAddressCookie || "", address || "", { expires: cookieExpirationTime });
            Cookies.set(passwordCookie || "", userPassword || "", { expires: cookieExpirationTime });
        }
    })

    const onClickSubmitAnswersButton = async () => {
        const currentBlock = await engagementRewards?.getCurrentBlockNumber();
        const validUntilBlock = (currentBlock || 1000000000n) + 50n // Valid for 10 blocks
        
        try {
            let signature = "0x";
            if (inviter && chain.id === 42220 && isRegisteredOnEngagementRewards==0)
                signature = await engagementRewards?.signClaim(
                    chainsToContracts[chain?.id]["Certifier"].address,
                    inviter || ZERO_ADDRESS,
                    validUntilBlock
                ) as any;
                
            console.log("id, hashedAnswer, examPrice, inviter, validUntilBlock, signature:",
                id, hashedAnswerToSubmit, examPriceInEth, inviter, validUntilBlock, signature);
                
            // set cookie
            console.log(userPassword);
            
            if (hashedAnswerToSubmit && exam && (exam.price > 0 ? examPriceInEth : true) && answers.length === exam?.questions?.length)
                handleSubmitAnswers(submitAnswers, id, hashedAnswerToSubmit, examPriceInEth!, inviter || ZERO_ADDRESS, validUntilBlock, signature);
        } catch (error) {
            console.log(error);
        }
    }

    const VerifyAccountMessage = () => {
        return <div>
            {"\n"}You need to verify your account.{"\n"}
            Click on the &quot;CLAIM NOW&quot; button&nbsp;
            <a className="text-base-100" target="_blank" rel="noopener noreferrer" href='https://gooddapp.org/#/claim'>
                here
            </a>.
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
                        The system uses cookies to store your password.
                        This means that you can claim your certificate only from this device.
                        {needsVerification ? <VerifyAccountMessage /> : ""}
                    </div>
                }
            />

            {!needsVerification && !userHasAlreadyClaimedFaucetFunds && <SubmitAnswersFaucet id={id} user={address} chainId={chain?.id}/>}
            
        </>
    );
}

export default UserOpenNotSubmitted