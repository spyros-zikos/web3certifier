"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { Box } from "@chakra-ui/react";
import { PageWrapper, Title } from "~~/components";
import { useAccount } from "wagmi";
import { handleClaimCertificate, handleCorrectExam, handleRefundExam, handleSubmitAnswers } from "./helperFunctions/WriteToContract";
import { ExamStage } from "../../types/ExamStage";
import getCertifierStatsAfterCorrection from "./helperFunctions/GetStats";
import { examStage } from "./helperFunctions/examStage";
import { getStatusStr } from "~~/utils/StatusStr";
import ExamDetails from "./_components/ExamDetails";
import { keyLength, getHashedAnswerAndMessageWithPassword, getVariablesFromPasswordOrCookies, getHashedAnswerAndMessageWithCookies } from "./helperFunctions/HandleKey";
import Cookies from 'js-cookie';


const ExamPage = () => {
    const { address } = useAccount();
    const searchParams = useSearchParams();
    const id = BigInt(searchParams.get("id")!);

    /*//////////////////////////////////////////////////////////////
                          READ FROM CONTRACT
    //////////////////////////////////////////////////////////////*/

    const exam: Exam | undefined = useScaffoldReadContract({
        contractName: "Certifier",
        functionName: "getExam",
        args: [id],
    }).data;

    const userHasClaimed = useScaffoldReadContract({
        contractName: "Certifier",
        functionName: "getUserHasClaimed",
        args: [address, id],
    }).data;

    const userAnswer = useScaffoldReadContract({
        contractName: "Certifier",
        functionName: "getUserAnswer",
        args: [address, id],
    }).data;

    const examPriceInEth = useScaffoldReadContract({
        contractName: "Certifier",
        functionName: "getUsdToEthRate",
        args: [BigInt(exam ? exam.price.toString() : 0)],
    }).data;

    const statusNum: number | undefined = useScaffoldReadContract({
        contractName: "Certifier",
        functionName: "getStatus",
        args: [id],
    }).data;

    /*//////////////////////////////////////////////////////////////
                           WRITE TO CONTRACT
    //////////////////////////////////////////////////////////////*/

    const { writeContractAsync: submitAnswers } = useScaffoldWriteContract("Certifier");
    const { writeContractAsync: refundExam } = useScaffoldWriteContract("Certifier");
    const { writeContractAsync: claimCertificate } = useScaffoldWriteContract("Certifier");
    const { writeContractAsync: correctExam } = useScaffoldWriteContract("Certifier");

    // Get key | For exam stage: User_StartedNotSubmitted
    const [randomKey, _] = useState(Math.floor((10**keyLength) * Math.random()));
    // For exam stage: User_StartedNotSubmitted, Certifier_Correct, User_ClaimCertificate
    const [answers, setAnswers] = useState<bigint[]>([BigInt(0)]);
    // For exam stage: User_ClaimCertificate
    const [userPasswordInput, setUserPasswordInput] = useState<string>("");
    const [failScore, setFailScore] = useState<number>(-1);
    // For exam stage: Certifier_EndStats
    const [certifierStatsAfterCorrection, setCertifierStatsAfterCorrection] = useState<string>("");

    // Stats
    useEffect(() => {
        const fetchData = async () => {
            const stats = await getCertifierStatsAfterCorrection(exam!);
            setCertifierStatsAfterCorrection(stats);
        };
        if (exam) fetchData();
    }, [exam]);

    const getExamStage = () => {
        const status = getStatusStr(statusNum);
        const userHasNotParticipated = userAnswer==="0x0000000000000000000000000000000000000000000000000000000000000000";
        return examStage(status, userHasNotParticipated, address, exam, userHasClaimed);
    }

    const getExamStageMessageAndButton = (stage: any): ExamPageDynamicElements => {
        switch (stage) {
            case ExamStage.Certifier_Started:
                return { message: "This exam is ongoing! The certifier cannot submit.", buttonAction: undefined, buttonText: undefined };
            case ExamStage.User_StartedSubmitted:
                return { message: "Your answers are submitted!", buttonAction: undefined, buttonText: undefined };
            case ExamStage.User_WaitForCorrection:
                return { message: "This exam is being corrected by the certifier!", buttonAction: undefined, buttonText: undefined };
            case ExamStage.Certifier_EndStats:
                return { message: "This exam has ended!\n\n" + certifierStatsAfterCorrection, buttonAction: undefined, buttonText: undefined };
            case ExamStage.User_EndStats:
                return { message: "This exam has ended! You completed it successfully!", buttonAction: undefined, buttonText: undefined }; // Can add stats
            case ExamStage.User_Details:
                return { message: "This exam has ended. You did not participate!", buttonAction: undefined, buttonText: undefined }; // Can add stats
            case ExamStage.Both_CancelStats:
                return { message: "The exam has been cancelled!", buttonAction: undefined, buttonText: undefined };
            case ExamStage.User_StartedNotSubmitted:
                const [message, hashedAnswer] = exam?.userClaimsWithPassword
                ? getHashedAnswerAndMessageWithPassword(answers, randomKey, address)
                : getHashedAnswerAndMessageWithCookies(answers, randomKey, id, address);
                return {
                    message: message,
                    buttonAction: () => 
                        {hashedAnswer
                            ? exam && (exam.price > 0 ? examPriceInEth : true)
                                && answers.length === exam.questions.length
                                && handleSubmitAnswers(submitAnswers, id, hashedAnswer, examPriceInEth!)
                            : 0
                        },
                    buttonText: "Submit"
                };
            case ExamStage.Certifier_Correct:
                return {
                    message: "This exam needs correcting. Please provide the correct answers within 5 minutes of the end of the exam.",
                    buttonAction: () => {handleCorrectExam(correctExam, id, answers)},
                    buttonText: "Correct Exam"
                };
            case ExamStage.User_ClaimRefund:
                return {
                    message: "You can claim your refund!",
                    buttonAction: () => {handleRefundExam(refundExam, id)},
                    buttonText: "Claim Refund"
                };
            case ExamStage.User_ClaimCertificate:
                const cookiePassword = Cookies.get(`w3c.${id}.${address}`);
                const [key, answersArray, numberOfCorrectAnswers, passwordHashGood] = getVariablesFromPasswordOrCookies((exam?.userClaimsWithPassword ? userPasswordInput : (cookiePassword || "")), exam, address, userAnswer);
                
                // if the user clicked on the button and failed the exam
                if (failScore > -1)
                    return {
                        message: exam ? 
                        <div>You failed this exam! Your score was {failScore}/{exam.questions.length} {""}
                            but you need at least {exam!.baseScore.toString()}/{exam.questions.length} to pass.</div>
                        : <div>Loading...</div>,
                        buttonAction: undefined,
                        buttonText: undefined
                    };

                return {
                    // Tell the user to input their password
                    message:
                        exam?.userClaimsWithPassword
                        ? <div>
                            <div>The exam has ended. You can claim your certificate! To do so, enter your password below.</div>
                            <input
                                className="border-2 border-blue-400 text-base-content bg-base-100 p-2 mt-2 mr-2 min-w-[200px] sm:w-1/2 md:w-1/3 lg:w-1/4 rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-accent"
                                type="text"
                                value={userPasswordInput}
                                placeholder="Password"
                                onChange={e => setUserPasswordInput(e.target.value)}
                            />
                            {   // Wrong password notification
                                (passwordHashGood)
                                ? <></>
                                : <div className="mt-4">Your password is incorrect!</div>
                            }
                        </div>
                        : <div>Try to claim your certificate!</div>,
                    // Button exists only if password is good
                    buttonAction:
                        (passwordHashGood) ?
                        () => {
                            if (numberOfCorrectAnswers < exam!.baseScore)
                                setFailScore(numberOfCorrectAnswers);
                            else
                                userPasswordInput || cookiePassword ? handleClaimCertificate(claimCertificate, id, answersArray, BigInt(key)) : 0
                        }
                        : exam?.userClaimsWithPassword ? undefined : () => setFailScore(numberOfCorrectAnswers),
                    // Button exists only if password is good
                    buttonText:
                        (passwordHashGood) ? "Claim Certificate" : undefined
                };

            default:
                return { message: "Unknown stage", buttonAction: undefined, buttonText: undefined };
        }
    }

    // Check for invalid page
    if (exam?.certifier === "0x0000000000000000000000000000000000000000") {
        return (
            <PageWrapper>
                <Title>Exam Page</Title>
                <Box>
                    <div className="text-2xl">Exam does not exist!</div>
                </Box>
            </PageWrapper>
        )
    }

    return (
        <PageWrapper>
            <ExamDetails
                exam={exam}
                message={getExamStageMessageAndButton(getExamStage()!).message}
                buttonAction={getExamStageMessageAndButton(getExamStage()!).buttonAction}
                buttonText={getExamStageMessageAndButton(getExamStage()!).buttonText}
                showAnswers={
                    (getExamStage() === ExamStage.User_StartedNotSubmitted) ||
                    (getExamStage() === ExamStage.Certifier_Correct)
                }
                answers={answers}
                setAnswers={setAnswers}
            />
        </PageWrapper>
    )
}

export default ExamPage