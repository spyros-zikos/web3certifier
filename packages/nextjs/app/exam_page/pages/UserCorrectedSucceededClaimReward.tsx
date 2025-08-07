import React, { useState } from "react";
import { IndexSelector } from "~~/components/IndexSelector";
import { handleClaimReward } from "../helperFunctions/Handlers";
import { wagmiWriteToContract } from "~~/hooks/wagmi/wagmiWrite";
import { Question, MessageForUser, ClaimButton, Confetti } from "../_components";

const UserCorrectedSucceededClaimReward = ({
    exam, rewardAddress
}: {
    exam: Exam | undefined, rewardAddress: string
}) => {
    const [questionNumber, setQuestionNumber] = useState<number>(1);
    const [showConfetti, setShowConfetti] = useState(false);

    const { writeContractAsync: claimReward } = wagmiWriteToContract();
    const onClickClaimRewardButton = () => {
        handleClaimReward(claimReward, rewardAddress)
        setShowConfetti(true);
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
                message="Claim your reward!"
            />

            <ClaimButton text="Claim Reward" onClick={onClickClaimRewardButton}/>

            <Confetti show={showConfetti} />
        </>
    );
}

export default UserCorrectedSucceededClaimReward