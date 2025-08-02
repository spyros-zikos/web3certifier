import React, { useState } from "react"
import { wagmiReadFromContract } from "~~/hooks/wagmi/wagmiRead";
import { Button } from "~~/components";
import { ArrowDownIcon } from "@heroicons/react/24/outline";
import RewardInfoDropDown from "./RewardInfoDropDown";
import ExamInfoDropDown from "./ExamInfoDropDown";
import { IndexSelector } from "~~/components/IndexSelector";
import ResponsivePageWrapper from "~~/components/ResponsivePageWrapper";
import Timer from "./Timer";
import ImageNameDescription from "./ImageNameDescription";
import ProgressBar from "./ProgressBar";
import Question from "./Question";
import MessageForUser from "./MessageForUser";
import Link from "next/link";
import { ManageReward } from "~~/app/rewards/pages";
import ManageRewardsLink from "./ManageRewardsLink";


const ExamDetails = (
    {
        exam, 
        message, 
        buttonAction, 
        buttonText, 
        showAnswers, 
        showRewards, 
        answers, 
        setAnswers,
        timer
    }:
    {
        exam: Exam|undefined,
        message: any,
        buttonAction?: any,
        buttonText?: string,
        showAnswers: boolean,
        showRewards: boolean,
        answers: bigint[],
        setAnswers: any,
        timer: [string, string]
    }
) => {
    const [questionNumber, setQuestionNumber] = useState<number>(1);

    const status: number | undefined = wagmiReadFromContract({
        functionName: "getExamStatus",
        args: [exam?.id],
    }).data as any;

    return (
        <ResponsivePageWrapper>
            { showRewards && <ManageRewardsLink id={exam?.id || BigInt(0)} /> }

            {/* Image, Name, Description */}
            <ImageNameDescription exam={exam} />

            {/* Timer */}
            { timer[0] !== "" && <Timer message={timer[0]} timeLeft={timer[1]} /> }

            {/* Exam Information */}
            <ExamInfoDropDown status={status} exam={exam} />

            {/* Reward Information */}
            <RewardInfoDropDown id={exam?.id || BigInt(0)} />

            {/* Progress Bar */}
            {exam?.questions && exam?.questions.length > 1 &&
                <ProgressBar exam={exam} questionNumber={questionNumber} />
            }

            {/* Questions */}
            <Question questionNumber={questionNumber} exam={exam} showAnswers={showAnswers} answers={answers} setAnswers={setAnswers} />
            
            <IndexSelector setIndex={setQuestionNumber} index={questionNumber} firstIndex={1} lastIndex={exam?.questions ? exam?.questions.length : 1} submitButton={buttonText ? <Button className="w-24 bg-base-100" onClick={buttonAction}>{buttonText}</Button> : undefined}/>

            <MessageForUser message={message} />
            
        </ResponsivePageWrapper>
    );
}

export default ExamDetails