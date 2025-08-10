import React, { useEffect, useState } from "react"
import { wagmiReadFromContract } from "~~/hooks/wagmi/wagmiRead";
import { IndexSelector } from "~~/components/IndexSelector";
import { getHashedAnswerAndMessageWithCookies, keyLength } from "../helperFunctions/PasswordManagement";
import Cookies from 'js-cookie';
import { handleSubmitAnswers } from "../helperFunctions/Handlers";
import { wagmiWriteToContract } from "~~/hooks/wagmi/wagmiWrite";
import { Question, MessageForUser, ExamStartWarningBox } from "../_components";
import { Box } from "@chakra-ui/react";
import { cookieExpirationTime, timePerQuestion } from "~~/constants";


const UserOpenNotSubmitted = ({
    id, exam, address, chain
}: {
    id: bigint, exam: Exam | undefined, address: string | undefined, chain: any
}) => {
    const [questionNumber, setQuestionNumber] = useState<number>(0);
    const [answers, setAnswers] = useState<bigint[]>(Array(exam?.questions.length).fill(BigInt(0)));
    const [randomKey, _] = useState(Math.floor((10**keyLength) * Math.random()));
    const [startTime, setStartTime] = useState(0);
    const [timeEnded, setTimeEnded] = useState(false);

    const passwordCookie = `w3c.${chain?.id}.${id}.${address}`;
    const startTimeCookie = `w3c.${chain?.id}.${id}.${address}.startTime`;

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
    
    const needsVerification = !isVerifiedOnCelo && chain?.id === 42220;
    const [hashedAnswerToSubmit, userPassword] = getHashedAnswerAndMessageWithCookies(answers, randomKey, address);

    const { writeContractAsync: submitAnswers } = wagmiWriteToContract();
    const onClickSubmitAnswersButton = () => {
        // set cookie
        Cookies.set(passwordCookie, userPassword, { expires: cookieExpirationTime });
        console.log(userPassword);

        hashedAnswerToSubmit
        ? exam && (exam.price > 0 ? examPriceInEth : true)
            && answers.length === exam?.questions?.length
            && handleSubmitAnswers(submitAnswers, id, hashedAnswerToSubmit, examPriceInEth!)
        : 0
    }

    const VerifyAccountMessage = () => {
        return <div>
            {"\n"}You need to verify your account.{"\n"}
            Click on the &quot;CLAIM NOW&quot; button
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
        console.log(getCurrentTimestamp() - startTime);
    }, [getCurrentTimestamp()]);

    /// if a user clicks next before the timer of the question goes to 0, the remaining time must be discarded
    /// the way this is done is by making the startTime be sooner by the remaining time
    const handleNextQuestion = (nextQuestionNumber: number) => {
        // calculate remaining time
        const timeRemainingForPreviousQuestion = Math.max(0, startTime + (questionNumber * timePerQuestion) - getCurrentTimestamp());
        console.log(timeRemainingForPreviousQuestion);
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
                submitButtonOnClick={onClickSubmitAnswersButton}
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
        </>
    );
}

export default UserOpenNotSubmitted