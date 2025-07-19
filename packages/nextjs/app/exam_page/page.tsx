"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Box, Text } from "@chakra-ui/react";
import { PageWrapper, Title } from "~~/components";
import { useAccount } from "wagmi";
import { handleClaimCertificate, handleCorrectExam, handleRefundExam, handleSubmitAnswers } from "./helperFunctions/Handlers";
import { ExamStage } from "../../types/ExamStage";
import getCertifierStatsAfterCorrection from "./helperFunctions/GetStats";
import { examStage } from "./helperFunctions/examStage";
import { getExamStatusStr, getUserStatusStr } from "~~/utils/StatusStr";
import ExamDetails from "./_components/ExamDetails";
import { keyLength, getHashedAnswerAndMessageWithPassword, getVariablesFromPasswordOrCookies, getHashedAnswerAndMessageWithCookies } from "./helperFunctions/PasswordManagement";
import Cookies from 'js-cookie';
import { wagmiWriteToContract } from "~~/hooks/wagmi/wagmiWrite";
import { wagmiReadFromContract } from "~~/hooks/wagmi/wagmiRead";
import {SUPPORTED_NETWORKS, ZERO_ADDRESS} from "~~/constants";

const ExamPage = () => {
    const { address, chain } = useAccount();
    const searchParams = useSearchParams();
    const id = BigInt(searchParams.get("id")!);
    const [timeNow, setTimeNow] = useState(Date.now());

    /*//////////////////////////////////////////////////////////////
                          READ FROM CONTRACT
    //////////////////////////////////////////////////////////////*/

    const exam: Exam | undefined  = wagmiReadFromContract({
        functionName: "getExam",
        args: [id],
    }).data;

    const questionsWithAnswers = exam?.questions;

    const userStatusNum = wagmiReadFromContract({
        functionName: "getUserStatus",
        args: [address, id],
    }).data;

    const userHashedAnswer = wagmiReadFromContract({
        functionName: "getUserHashedAnswer",
        args: [address, id],
    }).data;

    const examPriceInEth = wagmiReadFromContract({
        functionName: "getUsdToEthRate",
        args: [BigInt(exam ? exam.price.toString() : 0)],
    }).data;

    const examStatusNum: number | undefined = wagmiReadFromContract({
        functionName: "getExamStatus",
        args: [id],
    }).data;

    const timeToCorrect: bigint | undefined = wagmiReadFromContract({
        functionName: "getTimeToCorrectExam",
    }).data;

    const isVerifiedOnCelo: boolean = wagmiReadFromContract({
        functionName: "getIsVerifiedOnCelo",
        args: [address],
    }).data;

    const userScore: bigint | undefined = wagmiReadFromContract({
        functionName: "getUserScore",
        args: [id, address],
    }).data;

    const rewardAddress = wagmiReadFromContract({
        contractName: "RewardFactory",
        functionName: "getRewardByExamId",
        args: [id],
    }).data;

    /*//////////////////////////////////////////////////////////////
                           WRITE TO CONTRACT
    //////////////////////////////////////////////////////////////*/

    const { writeContractAsync: submitAnswers } = wagmiWriteToContract();
    const { writeContractAsync: refundExam } = wagmiWriteToContract();
    const { writeContractAsync: claimCertificate } = wagmiWriteToContract();
    const { writeContractAsync: correctExam } = wagmiWriteToContract();
    

    // Get key | For exam stage: User_OpenNotSubmitted
    const [randomKey, _] = useState(Math.floor((10**keyLength) * Math.random()));
    // For exam stage: User_OpenNotSubmitted, Certifier_Correct, User_ClaimCertificate
    const [answers, setAnswers] = useState<bigint[]>([BigInt(0)]);
    // For exam stage: User_ClaimCertificate
    const [userPasswordInput, setUserPasswordInput] = useState<string>("");
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

    useEffect(() => {
        const interval = setInterval(() => {
            setTimeNow(Date.now());
        }, 1000); // update every second
    
        return () => clearInterval(interval); // cleanup
    }, []);

    const getExamStage = () => {
        const examStatus = getExamStatusStr(examStatusNum);
        const userStatus = getUserStatusStr(userStatusNum);
        return examStage(examStatus, userStatus, address, exam);
    }

    const getExamStageMessageAndButton = (examStage: any): ExamPageDynamicElements => {
        switch (examStage) {
            case ExamStage.User_OpenNotSubmitted:
                const needsVerification = !isVerifiedOnCelo && chain?.id === 42220;
                const [userNotSubmittedMessage, hashedAnswerToSubmit, userPassword] = exam?.userClaimsWithPassword
                    ? getHashedAnswerAndMessageWithPassword(answers, randomKey, address, needsVerification)
                    : getHashedAnswerAndMessageWithCookies(answers, randomKey, address, needsVerification);
                return {
                    message: userNotSubmittedMessage,
                    buttonAction: () => 
                        {
                            // set cookie
                            Cookies.set(`w3c.${chain?.id}.${id}.${address}`, userPassword, { expires: 10000 });
                            console.log(userPassword);

                            hashedAnswerToSubmit
                            ? exam && (exam.price > 0 ? examPriceInEth : true)
                                && answers.length === questionsWithAnswers?.length
                                && handleSubmitAnswers(submitAnswers, id, hashedAnswerToSubmit, examPriceInEth!)
                            : 0
                        },
                    buttonText: "Submit"
                };
            case ExamStage.User_OpenSubmitted:
                return { message: "Your answers are submitted!", buttonAction: undefined, buttonText: undefined };
            case ExamStage.User_WaitForCorrection:
                return { message: "This exam is being corrected by the certifier!", buttonAction: undefined, buttonText: undefined };  
            case ExamStage.User_EndSuccessStats:
                return { message: <div>This exam has ended! You completed it successfully!</div>, buttonAction: undefined, buttonText: undefined }; // Can add stats
            case ExamStage.User_EndFailStats:
                return {
                    message: exam
                    ? <div>
                        You failed this exam! Your score was {userScore?.toString()}/{questionsWithAnswers?.length} {""}
                        but you need at least {exam!.baseScore.toString()}/{questionsWithAnswers?.length} to pass.
                    </div>
                    : <div>Loading...</div>,
                    buttonAction: undefined,
                    buttonText: undefined
                }; // Can add stats
            case ExamStage.User_Details:
                return { message: "This exam has ended. You did not participate!", buttonAction: undefined, buttonText: undefined }; // Can add stats
            case ExamStage.User_ClaimRefund:
                return {
                    message: "You can claim your refund!",
                    buttonAction: () => {handleRefundExam(refundExam, id)},
                    buttonText: "Claim Refund"
                };
            case ExamStage.User_ClaimCertificate:
                const cookiePassword = Cookies.get(`w3c.${chain?.id}.${id}.${address}`);
                const [key, userAnswers, passwordHashGood] = getVariablesFromPasswordOrCookies((exam?.userClaimsWithPassword ? userPasswordInput : (cookiePassword || "")), address, userHashedAnswer);
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
                        : <div>{passwordHashGood? "Claim your certificate!" : "Cookie not found!"}</div>,
                    // Button exists only if password is good
                    buttonAction:
                        (passwordHashGood) ?
                        () => {
                                userPasswordInput || cookiePassword ? handleClaimCertificate(claimCertificate, id, userAnswers, BigInt(key)) : 0
                        }
                        : undefined,
                    // Button exists only if password is good
                    buttonText:
                        (passwordHashGood) ? "Claim Certificate" : undefined
                };
            case ExamStage.Certifier_Open:
                return { message: "This exam is ongoing! The certifier cannot submit.", buttonAction: undefined, buttonText: undefined };
            case ExamStage.Certifier_Correct:
                return {
                    message: "This exam needs correcting. Please provide the correct answers within the correction period of the exam.",
                    buttonAction: () => {handleCorrectExam(correctExam, id, answers.map(answer => answer.toString()).reduce((a, b) => a + b, ""))},
                    buttonText: "Correct Exam"
                };
            case ExamStage.Certifier_EndStats:
                return { message: "This exam has ended!\n\n" + certifierStatsAfterCorrection, buttonAction: undefined, buttonText: undefined };
            case ExamStage.Both_CancelStats:
                return { message: "The exam has been cancelled!", buttonAction: undefined, buttonText: undefined };
            
            default:
                return { message: "Unknown stage", buttonAction: undefined, buttonText: undefined };
        }
    }

    // Check that user is connected to supported network
    if (!chain?.id || !SUPPORTED_NETWORKS.includes(chain.id)) {
        return (
            <PageWrapper>
                <Title>Exam Page</Title>
                <Box>
                    <div className="text-2xl mt-32">Connect your wallet to a supported network (Arbitrum or Celo)</div>
                </Box>
            </PageWrapper>
        );
    }

    // Check for invalid page
    if (exam?.certifier === ZERO_ADDRESS) {
        return (
            <PageWrapper>
                <Title>Exam Page</Title>
                <Box>
                    <div className="text-2xl mt-32">This exam does not exist on this network.</div>
                </Box>
            </PageWrapper>
        );
    }
    
    function getTimeLeft(now: number, deadline: bigint) {
        const deadlineDate = new Date(Number(deadline) * 1000);
        const diffMs = deadlineDate.getTime() - now > 0 ? deadlineDate.getTime() - now : 0;
        const timeLeft = Math.floor(diffMs / 1000);

        const days = Math.floor(timeLeft / (3600 * 24));
        const hours = Math.floor((timeLeft % (3600 * 24)) / 3600);
        const minutes = Math.floor((timeLeft % 3600) / 60);
        const seconds = timeLeft % 60;

        return `${days > 0 ? days + "d ":""}${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    }

    return (
        <Box paddingX={10} paddingY={8}>
            <ExamDetails
                exam={exam}
                message={getExamStageMessageAndButton(getExamStage()!).message}
                buttonAction={getExamStageMessageAndButton(getExamStage()!).buttonAction}
                buttonText={getExamStageMessageAndButton(getExamStage()!).buttonText}
                showAnswers={
                    (getExamStage() === ExamStage.User_OpenNotSubmitted) ||
                    (getExamStage() === ExamStage.Certifier_Correct)
                }
                showRewards={
                    rewardAddress !== ZERO_ADDRESS ||
                    getExamStage() === ExamStage.Certifier_Open ||
                    getExamStage() === ExamStage.Certifier_Correct ||
                    getExamStage() === ExamStage.Certifier_EndStats
                }
                answers={answers}
                setAnswers={setAnswers}
                timer={(getExamStage() === ExamStage.User_OpenNotSubmitted ||
                    getExamStage() === ExamStage.User_OpenSubmitted ||
                    getExamStage() === ExamStage.Certifier_Open
                    )
                    ? ['Time Left To Submit', exam ? getTimeLeft(timeNow, exam.endTime) : ""]
                    : getExamStage() === ExamStage.Certifier_Correct
                    ? ['Time Left To Correct', exam ? getTimeLeft(timeNow, exam!.endTime + BigInt(timeToCorrect || 0)) : ""]
                    : getExamStage() === ExamStage.User_WaitForCorrection
                    ? ['Correction Duration', exam ? getTimeLeft(timeNow, exam!.endTime + BigInt(timeToCorrect || 0)) : ""]
                    : ['', '']
                }
            />
        </Box>
    )
}

export default ExamPage