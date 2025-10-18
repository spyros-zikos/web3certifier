import React, { useState } from "react"
import { IndexSelector } from "~~/components/IndexSelector";
import { handleCorrectExam } from "../helperFunctions/Handlers";
import { wagmiWriteToContract } from "~~/hooks/wagmi/wagmiWrite";
import { Question, MessageForUser } from "../_components";
import { getUserAnswersFromLocalStorage } from "~~/utils/handleLocalStorage";
import examStageMessageFunction from "../_components/examStageMessage";
import { ExamStage } from "~~/types/ExamStage";

const CertifierUnderCorrection = ({
    id, exam, chain
}: {
    id: bigint, exam: Exam | undefined, chain: any
}) => {
    const [questionNumber, setQuestionNumber] = useState<number>(1);

    const { writeContractAsync: correctExam } = wagmiWriteToContract();
    const onClickSubmitAnswersButton = () => {
        const answers = getUserAnswersFromLocalStorage(chain, exam);
        handleCorrectExam(correctExam, id, answers.map((answer: number) => answer.toString()).reduce((a: any, b: any) => a + b, ""))
    }

    return (
        <>
            {/* Questions */}
            <Question questionNumber={questionNumber} exam={exam} showAnswers={true} />

            <IndexSelector
                setIndex={setQuestionNumber}
                index={questionNumber}
                firstIndex={1}
                lastIndex={exam?.questions ? exam?.questions.length : 1}
                submitButtonOnClick={onClickSubmitAnswersButton}
            />

            <MessageForUser 
                message={examStageMessageFunction(ExamStage.Certifier_UnderCorrection)()}
            />
        </>
    );
}

export default CertifierUnderCorrection