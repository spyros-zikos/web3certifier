"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Box } from "@chakra-ui/react";
import { ButtonLink, PageWrapper, ResponsivePageWrapper, Spinner, Title } from "~~/components";
import { ExamStage } from "../../types/ExamStage";
import { examStage } from "./helperFunctions/examStage";
import { getExamStatusStr, getUserStatusStr } from "~~/utils/StatusStr";
import { wagmiReadFromContract } from "~~/hooks/wagmi/wagmiRead";
import { SUPPORTED_NETWORKS, ZERO_ADDRESS } from "~~/constants";
import { UserOpenNotSubmitted, UserCancelledClaimRefund, UserCorrectedClaimCertificate, UserCorrectedSucceededPatricipateInDraw, UserCorrectedSucceededClaimReward, CertifierUnderCorrection, CertifierCorrected } from "./pages";
import StaticExamPage from "./pages/StaticExamPage";
import { DropDowns, ImageNameDescription, InviteLinkMessage, ManageRewardsLink, Timer } from "./_components";
import getTimeLeft from "~~/utils/GetTimeLeft";
import { useNonUndefinedAccount } from "~~/utils/NonUndefinedAccount";
import examStageMessageFunction from "./_components/examStageMessage";
import { DistributionType } from "~~/types/RewardTypes";
import { winnerHasBeenDrawn } from "~~/utils/winnerHasBeenDrawn";


const ExamPage = () => {
    const { address, chain, isConnected } = useNonUndefinedAccount();
    const searchParams = useSearchParams();
    const id = BigInt(searchParams.get("id")!);
    const [timeNow, setTimeNow] = useState(Date.now());

    /*//////////////////////////////////////////////////////////////
                          READ FROM CONTRACT
    //////////////////////////////////////////////////////////////*/

    const exam: Exam | undefined = wagmiReadFromContract({
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
        functionName: "rewardAmountForUser",
        args: [address],
    }).data;

    const totalRewardAmount: bigint  = wagmiReadFromContract({
        contractName: "Reward",
        contractAddress: rewardAddress,
        functionName: "rewardTokenBalance",
    }).data;

    const isEligible: boolean = wagmiReadFromContract({
        contractName: "Reward",
        contractAddress: rewardAddress,
        functionName: "isEligible",
        args: [address],
    }).data;

    const usersThatClaimed: string[] = wagmiReadFromContract({
        contractName: "Reward",
        contractAddress: rewardAddress,
        functionName: "getUsersThatClaimed",
    }).data;

    const distributionTypeNumber: number  = wagmiReadFromContract({
        contractName: "Reward",
        contractAddress: rewardAddress,
        functionName: "getDistributionType",
    }).data;
    const distributionType = Object.values(DistributionType)[distributionTypeNumber];

    const distributionParameter = wagmiReadFromContract({
        contractName: "Reward",
        contractAddress: rewardAddress,
        functionName: "getDistributionParameter",
    }).data;
    
    const timeToExecuteDrawPassed = wagmiReadFromContract({
        contractName: "Reward",
        contractAddress: rewardAddress,
        functionName: "timeToExecuteDrawPassed",
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
        const rewardExistsAndUserHasNotClaimed = !userHasClaimedReward && hasReward;
        const drawIsOpenForParticipants = (distributionType === DistributionType.DRAW) && !timeToExecuteDrawPassed;

        return examStage(
            examStatus,
            userStatus,
            address,
            exam,
            rewardExistsAndUserHasNotClaimed,
            isEligible,
            rewardAmount,
            totalRewardAmount,
            drawIsOpenForParticipants
        );
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

    if (!exam) return <Spinner />

    return (
        <ResponsivePageWrapper>
            {/* Set Up/Manage Rewards */}
            { address === exam?.certifier && 
            <>
            <ManageRewardsLink id={exam?.id || BigInt(0)} rewardAddress={rewardAddress} />
            <ButtonLink href={`/exam_page/edit?id=${exam?.id || BigInt(0)}`} className="ml-4">🖊️ Edit Exam</ButtonLink>
            </>
            }

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
                <StaticExamPage exam={exam} message={examStageMessageFunction(ExamStage.User_Open_Submitted)()} />
            // Under Correction
            : getExamStage() === ExamStage.User_UnderCorrection ?
                <StaticExamPage exam={exam} message={examStageMessageFunction(ExamStage.User_UnderCorrection)()} />
            // Cancelled
            : getExamStage() === ExamStage.User_Cancelled_ClaimRefund ?
                <UserCancelledClaimRefund id={id} exam={exam} />
            : getExamStage() === ExamStage.User_Cancelled_NoRefund ?
                <StaticExamPage exam={exam} message={examStageMessageFunction(ExamStage.User_Cancelled_NoRefund)()} />  
            // Corrected
            : getExamStage() === ExamStage.User_Corrected_ClaimCertificate ?
                <UserCorrectedClaimCertificate id={id} exam={exam} address={address} chain={chain} />

            : getExamStage() === ExamStage.User_Corrected_SucceededPatricipateInDraw ?
                <UserCorrectedSucceededPatricipateInDraw exam={exam} rewardAddress={rewardAddress} />
            : getExamStage() === ExamStage.User_Corrected_SucceededAlreadyParticipatesInDraw ?
                <StaticExamPage exam={exam} message={examStageMessageFunction(ExamStage.User_Corrected_SucceededAlreadyParticipatesInDraw)(getTimeLeft(Date.now(), distributionParameter))} />
            : getExamStage() === ExamStage.User_Corrected_SucceededClaimReward ?
                <UserCorrectedSucceededClaimReward exam={exam} rewardAddress={rewardAddress} rewardAmount={rewardAmount} />
            : getExamStage() === ExamStage.User_Corrected_SucceededClaimReward_NotEligible ?
                <StaticExamPage exam={exam} message={examStageMessageFunction(ExamStage.User_Corrected_SucceededClaimReward_NotEligible)()} />
            : getExamStage() === ExamStage.User_Corrected_SucceededClaimReward_NotEnoughTokens ?
                <StaticExamPage exam={exam} message={examStageMessageFunction(ExamStage.User_Corrected_SucceededClaimReward_NotEnoughTokens)()} />
            
            : getExamStage() === ExamStage.User_Corrected_SucceededNoReward ?
                <StaticExamPage exam={exam} message={examStageMessageFunction(ExamStage.User_Corrected_SucceededNoReward)(distributionType == DistributionType.DRAW, winnerHasBeenDrawn(usersThatClaimed), usersThatClaimed ? (usersThatClaimed[usersThatClaimed.length - 1] == address) : false)} />
            : getExamStage() === ExamStage.User_Corrected_Failed ?
                <StaticExamPage exam={exam} message={examStageMessageFunction(ExamStage.User_Corrected_Failed)(exam, userScore, questionsAndPossibleAnswers)} />
            : getExamStage() === ExamStage.User_Corrected_NotSubmitted ?
                <StaticExamPage exam={exam} message={examStageMessageFunction(ExamStage.User_Corrected_NotSubmitted)(isConnected)} />

            ////// Certifier //////
            // Open
            : getExamStage() === ExamStage.Certifier_Open ?
                <StaticExamPage exam={exam} message={examStageMessageFunction(ExamStage.Certifier_Open)()} />
            // Under Correction
            : getExamStage() === ExamStage.Certifier_UnderCorrection ?
                <CertifierUnderCorrection id={id} exam={exam} chain={chain} />
            // Cancelled
            : getExamStage() === ExamStage.Certifier_Cancelled ?
                <StaticExamPage exam={exam} message={examStageMessageFunction(ExamStage.Certifier_Cancelled)()} />
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