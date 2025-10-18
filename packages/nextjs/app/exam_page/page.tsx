"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Box } from "@chakra-ui/react";
import { PageWrapper, ResponsivePageWrapper, Title } from "~~/components";
import { ExamStage } from "../../types/ExamStage";
import { examStage } from "./helperFunctions/examStage";
import { getExamStatusStr, getUserStatusStr } from "~~/utils/StatusStr";
import { wagmiReadFromContract } from "~~/hooks/wagmi/wagmiRead";
import { SUPPORTED_NETWORKS, ZERO_ADDRESS } from "~~/constants";
import { UserOpenNotSubmitted, UserCancelledClaimRefund, UserCorrectedClaimCertificate, UserCorrectedSucceededClaimReward, CertifierUnderCorrection, CertifierCorrected } from "./pages";
import StaticExamPage from "./pages/StaticExamPage";
import { DropDowns, ImageNameDescription, InviteLinkMessage, JoinDiscordMessage, ManageRewardsLink, Timer } from "./_components";
import getTimeLeft from "./helperFunctions/GetTimeLeft";
import { useNonUndefinedAccount } from "~~/utils/NonUndefinedAccount";


const ExamPage = () => {
    const { address, chain, isConnected } = useNonUndefinedAccount();
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

    const questionsAndPossibleAnswers = exam?.questions;

    const userStatusNum = wagmiReadFromContract({
        functionName: "getUserStatus",
        args: [address, id],
    }).data;

    const examStatusNum: number | undefined = wagmiReadFromContract({
        functionName: "getExamStatus",
        args: [id],
    }).data;

    const userScore: bigint | undefined = wagmiReadFromContract({
        functionName: "getUserScore",
        args: [id, address],
    }).data;

    const timeToCorrect: bigint | undefined = wagmiReadFromContract({
        functionName: "getTimeToCorrectExam",
    }).data;

    const rewardAddress = wagmiReadFromContract({
        contractName: "RewardFactory",
        functionName: "getRewardByExamId",
        args: [id],
    }).data;

    const userHasClaimedReward = wagmiReadFromContract({
        contractName: "Reward",
        contractAddress: rewardAddress,
        functionName: "getUserHasClaimed",
        args: [address],
    }).data;


    const rewardAmount: bigint  = wagmiReadFromContract({
        contractName: "Reward",
        contractAddress: rewardAddress,
        functionName: "getRewardAmountForUser",
        args: [address],
    }).data;

    const totalRewardAmount: bigint  = wagmiReadFromContract({
        contractName: "Reward",
        contractAddress: rewardAddress,
        functionName: "getBalance",
    }).data;


    useEffect(() => {
        const interval = setInterval(() => {
            setTimeNow(Date.now());
        }, 1000); // update every second
    
        return () => clearInterval(interval); // cleanup
    }, []);

    const getExamStage: any = () => {
        const examStatus = getExamStatusStr(examStatusNum);
        const userStatus = getUserStatusStr(userStatusNum);
        const hasReward = rewardAddress !== ZERO_ADDRESS;
        const userCanClaimReward = !userHasClaimedReward && hasReward;
        return examStage(examStatus, userStatus, address, exam, userCanClaimReward, rewardAmount, totalRewardAmount);
    }

    // If user is connected, check that he's on supported network
    if (chain && !Object.values(SUPPORTED_NETWORKS).includes(chain.id)) {
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
                    <div className="text-2xl mt-32">Exam does not exist.<br /><br />Try connecting your wallet to a supported netwrok.</div>
                </Box>
            </PageWrapper>
        );
    }

    return (
        <ResponsivePageWrapper>
            {/* Set Up/Manage Rewards */}
            { address === exam?.certifier && <ManageRewardsLink id={exam?.id || BigInt(0)} rewardAddress={rewardAddress} /> }

            {/* Image, Name, Description */}
            <ImageNameDescription exam={exam} />

            {/* Submission Timer */}
            {examStatusNum == 0 && <Timer message={'Time Left To Submit'} timeLeft={exam ? getTimeLeft(timeNow, exam.endTime) : ""} />}
            {/* Correction Timer */}
            {examStatusNum == 1 && <Timer message={'Time Left To Correct'} timeLeft={exam ? getTimeLeft(timeNow, exam!.endTime + BigInt(timeToCorrect || 0)) : ""} />}

            <DropDowns exam={exam} status={examStatusNum} />

            { ////// User //////
            // Open
            getExamStage() === ExamStage.User_Open_NotSubmitted ?
                <UserOpenNotSubmitted id={id} exam={exam} address={address} chain={chain} />
            : getExamStage() === ExamStage.User_Open_Submitted ?
                <StaticExamPage exam={exam} message={
                    <>
                        <Box display="inline">Your answers are submitted!</Box> <JoinDiscordMessage />
                    </>}
                />
            // Under Correction
            : getExamStage() === ExamStage.User_UnderCorrection ?
                <StaticExamPage exam={exam} message="This exam is being corrected by the certifier!" />
            // Cancelled
            : getExamStage() === ExamStage.User_Cancelled_ClaimRefund ?
                <UserCancelledClaimRefund id={id} exam={exam} />
            : getExamStage() === ExamStage.User_Cancelled_NoRefund ?
                <StaticExamPage exam={exam} message={isConnected ? "The exam has been cancelled!" : "Connect your wallet to claim your refund!"} />  
            // Corrected
            : getExamStage() === ExamStage.User_Corrected_ClaimCertificate ?
                <UserCorrectedClaimCertificate id={id} exam={exam} address={address} chain={chain} />

            : getExamStage() === ExamStage.User_Corrected_SucceededClaimReward && (rewardAmount !== BigInt(0)) && (rewardAmount <= totalRewardAmount) ?
                <UserCorrectedSucceededClaimReward exam={exam} rewardAddress={rewardAddress} rewardAmount={rewardAmount} />
            : getExamStage() === ExamStage.User_Corrected_SucceededClaimReward_ZeroReward && (rewardAmount === BigInt(0)) ?
                <StaticExamPage exam={exam} message="This exam has ended! You completed it successfully! Unfortunately, you don't qualify for rewards." />
            : getExamStage() === ExamStage.User_Corrected_SucceededClaimReward_NotEnoughTokens && (rewardAmount > totalRewardAmount) ?
                <StaticExamPage exam={exam} message="This exam has ended! You completed it successfully! Unfortunately, the reward pool does not have enough tokens to reward you." />
            
            : getExamStage() === ExamStage.User_Corrected_SucceededNoReward ?
                <StaticExamPage exam={exam} message="This exam has ended! You completed it successfully!" />
            : getExamStage() === ExamStage.User_Corrected_Failed ?
                <StaticExamPage exam={exam} message={exam ? <div>You failed this exam! Your score was {userScore?.toString()}/{questionsAndPossibleAnswers?.length} {""} but you need at least {exam!.baseScore.toString()}/{questionsAndPossibleAnswers?.length} to pass.</div> : <div>Loading...</div>} />
            : getExamStage() === ExamStage.User_Corrected_NotSubmitted ?
                <StaticExamPage exam={exam} message={isConnected ? "This exam has ended. You did not participate!" : "Connect your wallet to claim your certificate!"} />

            ////// Certifier //////
            // Open
            : getExamStage() === ExamStage.Certifier_Open ?
                <StaticExamPage exam={exam} message="This exam is ongoing! The certifier cannot submit." />
            // Under Correction
            : getExamStage() === ExamStage.Certifier_UnderCorrection ?
                <CertifierUnderCorrection id={id} exam={exam} chain={chain} />
            // Cancelled
            : getExamStage() === ExamStage.Certifier_Cancelled ?
                <StaticExamPage exam={exam} message="The exam has been cancelled!" />
            // Corrected
            : getExamStage() === ExamStage.Certifier_Corrected &&
                <CertifierCorrected exam={exam} id={id} />
            }

            {/* Invite Link */}
            { (isConnected && chain.id === 42220) && (getExamStatusStr(examStatusNum) === "Open") &&
                <InviteLinkMessage id={id} address={address} />
            }
        </ResponsivePageWrapper>
    )
}

export default ExamPage