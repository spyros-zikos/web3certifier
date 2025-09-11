import React, { useState } from "react";
import { IndexSelector } from "~~/components/IndexSelector";
import { handleClaimReward } from "../helperFunctions/Handlers";
import { wagmiWriteToContract } from "~~/hooks/wagmi/wagmiWrite";
import { Question, MessageForUser, ClaimButton, Confetti } from "../_components";
import { wagmiReadFromContract } from "~~/hooks/wagmi/wagmiRead";

const UserCorrectedSucceededClaimReward = ({
    exam, rewardAddress, rewardAmount
}: {
    exam: Exam | undefined, rewardAddress: string, rewardAmount: bigint
}) => {
    const [questionNumber, setQuestionNumber] = useState<number>(1);
    const [showConfetti, setShowConfetti] = useState(false);

    const tokenAddress: string = wagmiReadFromContract({
        contractName: "Reward",
        contractAddress: rewardAddress,
        functionName: "getTokenAddress",
    }).data;
    
    const decimals: bigint  = wagmiReadFromContract({
        contractName: "ERC20",
        contractAddress: tokenAddress,
        functionName: "decimals",
    }).data;

    const tokenSymbol: string  = wagmiReadFromContract({
        contractName: "ERC20",
        contractAddress: tokenAddress,
        functionName: "symbol",
    }).data;

    const { writeContractAsync: claimReward } = wagmiWriteToContract();
    const onClickClaimRewardButton = () => {
        handleClaimReward(claimReward, rewardAddress)
        setShowConfetti(true);
    }

    const scaledRewardAmountForUser = Number(rewardAmount) / (Number(10) ** Number(decimals));

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
                message={"You claim can claim " + scaledRewardAmountForUser + " " + tokenSymbol + "! Claim your reward now!"}
            />

            <ClaimButton text="Claim Reward" onClick={onClickClaimRewardButton}/>

            <Confetti show={showConfetti} />
        </>
    );
}

export default UserCorrectedSucceededClaimReward