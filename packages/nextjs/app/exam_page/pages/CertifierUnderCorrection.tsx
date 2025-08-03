import React, { useState } from "react"
import { IndexSelector } from "~~/components/IndexSelector";
import { handleCorrectExam } from "../helperFunctions/Handlers";
import { wagmiWriteToContract } from "~~/hooks/wagmi/wagmiWrite";
import { Question, MessageForUser } from "../_components";


const CertifierUnderCorrection = ({
    id, exam
}: {
    id: bigint, exam: Exam | undefined
}) => {
    const [questionNumber, setQuestionNumber] = useState<number>(1);
    const [answers, setAnswers] = useState<bigint[]>([BigInt(0)]);

    const { writeContractAsync: correctExam } = wagmiWriteToContract();
    const onClickSubmitAnswersButton = () => {
        handleCorrectExam(correctExam, id, answers.map(answer => answer.toString()).reduce((a, b) => a + b, ""))
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
                message="This exam needs correcting. Please provide the correct answers within the correction period of the exam."
            />
        </>
    );
}

export default CertifierUnderCorrection