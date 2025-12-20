import React, { useState } from "react";
import { IndexSelector } from "~~/components/IndexSelector";
import { handleClaimReward } from "../helperFunctions/Handlers";
import { wagmiWriteToContract } from "~~/hooks/wagmi/wagmiWrite";
import { Question, MessageForUser, ClaimButton, Confetti } from "../_components";
import { ExamStage } from "~~/types/ExamStage";
import examStageMessageFunction from "../_components/examStageMessage";

const UserCorrectedSucceededPatricipateInDraw = ({
    exam, rewardAddress
}: {
    exam: Exam | undefined, rewardAddress: string
}) => {
    const [questionNumber, setQuestionNumber] = useState<number>(1);

    const { writeContractAsync: claimReward } = wagmiWriteToContract();
    const onClickParticipateButton = () => {
        handleClaimReward(claimReward, rewardAddress)
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
                message={examStageMessageFunction(ExamStage.User_Corrected_SucceededPatricipateInDraw)()}
            />

            <ClaimButton text="Participate in Draw" onClick={onClickParticipateButton}/>
        </>
    );
}

export default UserCorrectedSucceededPatricipateInDraw