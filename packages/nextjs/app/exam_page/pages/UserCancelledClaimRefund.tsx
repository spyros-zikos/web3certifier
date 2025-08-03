import React, { useState } from "react"
import { IndexSelector } from "~~/components/IndexSelector";
import { handleRefundExam } from "../helperFunctions/Handlers";
import { wagmiWriteToContract } from "~~/hooks/wagmi/wagmiWrite";
import { Question, MessageForUser, ClaimButton } from "../_components";

const UserCancelledClaimRefund = ({
    id, exam
}: {
    id: bigint, exam: Exam | undefined
}) => {
    const [questionNumber, setQuestionNumber] = useState<number>(1);

    const { writeContractAsync: refundExam } = wagmiWriteToContract();
    const onClickClaimRefundButton = () => {
        handleRefundExam(refundExam, id);
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
                message="You can claim your refund!"
            />

            <ClaimButton text="Claim Refund" onClick={onClickClaimRefundButton}/>
        </>
    );
}

export default UserCancelledClaimRefund