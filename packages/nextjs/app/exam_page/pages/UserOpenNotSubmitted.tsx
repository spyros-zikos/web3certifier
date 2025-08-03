import React, { useState } from "react"
import { wagmiReadFromContract } from "~~/hooks/wagmi/wagmiRead";
import { IndexSelector } from "~~/components/IndexSelector";
import { getHashedAnswerAndMessageWithCookies, keyLength } from "../helperFunctions/PasswordManagement";
import Cookies from 'js-cookie';
import { handleSubmitAnswers } from "../helperFunctions/Handlers";
import { wagmiWriteToContract } from "~~/hooks/wagmi/wagmiWrite";
import { Question, MessageForUser } from "../_components";


const UserOpenNotSubmitted = ({
    id, exam, address, chain
}: {
    id: bigint, exam: Exam | undefined, address: string | undefined, chain: any
}) => {
    const [questionNumber, setQuestionNumber] = useState<number>(1);
    const [answers, setAnswers] = useState<bigint[]>([BigInt(0)]);
    const [randomKey, _] = useState(Math.floor((10**keyLength) * Math.random()));

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

    return (
        <>
            {/* Questions */}
            <Question questionNumber={questionNumber} exam={exam} showAnswers={true} answers={answers} setAnswers={setAnswers} />

            <IndexSelector
                setIndex={setQuestionNumber}
                index={questionNumber}
                firstIndex={1}
                lastIndex={exam?.questions ? exam?.questions.length : 1}
                submitButtonOnClick={onClickSubmitAnswersButton}
            />

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