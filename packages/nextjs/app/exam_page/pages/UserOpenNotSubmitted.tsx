import React, { useEffect, useState } from "react"
import { wagmiReadFromContract } from "~~/hooks/wagmi/wagmiRead";
import { IndexSelector } from "~~/components/IndexSelector";
import { getHashedAnswerAndMessageWithCookies, keyLength } from "../helperFunctions/PasswordManagement";
import Cookies from 'js-cookie';
import { handleSubmitAnswers } from "../helperFunctions/Handlers";
import { wagmiWriteToContract } from "~~/hooks/wagmi/wagmiWrite";
import { Question, MessageForUser } from "../_components";
import { Box } from "@chakra-ui/react";
import { Button } from "~~/components";


const UserOpenNotSubmitted = ({
    id, exam, address, chain
}: {
    id: bigint, exam: Exam | undefined, address: string | undefined, chain: any
}) => {
    const [questionNumber, setQuestionNumber] = useState<number>(0);
    const [answers, setAnswers] = useState<bigint[]>(Array(exam?.questions.length).fill(BigInt(0)));
    const [randomKey, _] = useState(Math.floor((10**keyLength) * Math.random()));
    const [timeEnded, setTimeEnded] = useState(false);

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
        Cookies.set(`w3c.${chain?.id}.${id}.${address}`, userPassword, { expires: 10000 });
        console.log(userPassword);

        hashedAnswerToSubmit
        ? exam && (exam.price > 0 ? examPriceInEth : true)
            && answers.length === exam?.questions?.length
            && handleSubmitAnswers(submitAnswers, id, hashedAnswerToSubmit, examPriceInEth!)
        : 0
    }

    const VerifyAccountMessage = () => {
        return <div>{"\n"}You need to verify your account.{"\n"}Click on the &quot;CLAIM NOW&quot; button <a className="text-base-100" target="_blank" rel="noopener noreferrer" href='https://gooddapp.org/#/claim'>here</a>.</div>
    }

    const timePerQuestion = 30; // seconds
    const [startTime, setStartTime] = useState(0);
    
    const secondsNow = Math.floor(Date.now()/1000);

    useEffect(() => {
        if (startTime === 0) setStartTime(Number(Cookies.get(`w3c.${chain?.id}.${id}.${address}.startTime`)) || 0);
    
        const unboundQuestionNumber = Math.floor(((Date.now()/1000) - startTime) / timePerQuestion) + 1;
        if (unboundQuestionNumber > (exam?.questions.length || 1)) {
            setTimeEnded(true);
        } else {
            setTimeEnded(false);
        }

        const boundedQuestionNumber = Math.min(unboundQuestionNumber, exam?.questions.length || 1);
        if (startTime > 0) setQuestionNumber(Math.max(boundedQuestionNumber, questionNumber));
        console.log(secondsNow - startTime);
    }, [secondsNow]);

    const handleNextQuestion = (nextQuestionNumber: number) => {
        const timeRemainingForPreviousQuestion = Math.max(0, startTime + (questionNumber * timePerQuestion) - secondsNow);
        console.log(timeRemainingForPreviousQuestion);
        setStartTime(startTime - timeRemainingForPreviousQuestion);
        Cookies.set(`w3c.${chain?.id}.${id}.${address}.startTime`, (startTime - timeRemainingForPreviousQuestion).toString(), { expires: 10000 });
        setQuestionNumber(nextQuestionNumber);
    }

    return (
        <>
            {/* Questions */}
            {questionNumber > 0 ?
                <Question questionNumber={questionNumber} exam={exam} showAnswers={timeEnded ? false : true} answers={answers} setAnswers={setAnswers} />
                : 
                <Box display={"flex"} justifyContent={"center"} alignItems={"center"} bg="primary" w="full" h="500px" border="2px" borderStyle="solid" borderColor="lightGreen">
                    <Button
                        className="bg-base-100 w-32 h-12 font-bold text-xl"
                        onClick={() => {
                            const startTime = Math.floor(Date.now()/1000); 
                            Cookies.set(`w3c.${chain?.id}.${id}.${address}.startTime`, startTime.toString(), { expires: 10000 });
                            setQuestionNumber(1);
                        }}
                    >
                        Start
                    </Button>
                </Box>
            }

            {startTime > 0 &&
            <Box>Time left: &nbsp;
                {Math.max(0, startTime + (questionNumber * timePerQuestion) - secondsNow)}
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