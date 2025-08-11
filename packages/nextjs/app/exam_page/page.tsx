"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Box } from "@chakra-ui/react";
import { PageWrapper, ResponsivePageWrapper, Title } from "~~/components";
import { useAccount } from "wagmi";
import { ExamStage } from "../../types/ExamStage";
import { examStage } from "./helperFunctions/examStage";
import { getExamStatusStr, getUserStatusStr } from "~~/utils/StatusStr";
import { wagmiReadFromContract } from "~~/hooks/wagmi/wagmiRead";
import {SUPPORTED_NETWORKS, ZERO_ADDRESS} from "~~/constants";
import { UserOpenNotSubmitted, UserCancelledClaimRefund, UserCorrectedClaimCertificate, UserCorrectedSucceededClaimReward, CertifierUnderCorrection, CertifierCorrected } from "./pages";
import StaticExamPage from "./pages/StaticExamPage";
import { DropDowns, ImageNameDescription, ManageRewardsLink, Timer } from "./_components";
import getTimeLeft from "./helperFunctions/GetTimeLeft";


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
        return examStage(examStatus, userStatus, address, exam, userCanClaimReward);
    }

    // Check that user is connected to supported network
    if (!chain?.id || !Object.values(SUPPORTED_NETWORKS).includes(chain.id)) {
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

    return (
        <ResponsivePageWrapper>
            {/* Manage Rewards */}
            { address === exam?.certifier && <ManageRewardsLink id={exam?.id || BigInt(0)} /> }

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
            <StaticExamPage exam={exam} message="Your answers are submitted!" />
            // Under Correction
            : getExamStage() === ExamStage.User_UnderCorrection ?
            <StaticExamPage exam={exam} message="This exam is being corrected by the certifier!" />
            // Cancelled
            : getExamStage() === ExamStage.User_Cancelled_ClaimRefund ?
            <UserCancelledClaimRefund id={id} exam={exam} />
            : getExamStage() === ExamStage.User_Cancelled_NoRefund ?
            <StaticExamPage exam={exam} message="The exam has been cancelled!" />  
            // Corrected
            : getExamStage() === ExamStage.User_Corrected_ClaimCertificate ?
            <UserCorrectedClaimCertificate id={id} exam={exam} address={address} chain={chain} />
            : getExamStage() === ExamStage.User_Corrected_SucceededClaimReward ?
            <UserCorrectedSucceededClaimReward exam={exam} rewardAddress={rewardAddress} />
            : getExamStage() === ExamStage.User_Corrected_SucceededNoReward ?
            <StaticExamPage exam={exam} message="This exam has ended! You completed it successfully!" />
            : getExamStage() === ExamStage.User_Corrected_Failed ?
            <StaticExamPage exam={exam} message={exam ? <div> You failed this exam! Your score was {userScore?.toString()}/{questionsAndPossibleAnswers?.length} {""} but you need at least {exam!.baseScore.toString()}/{questionsAndPossibleAnswers?.length} to pass.</div> : <div>Loading...</div>} />
            : getExamStage() === ExamStage.User_Corrected_NotSubmitted ?
            <StaticExamPage exam={exam} message="This exam has ended. You did not participate!" />

            ////// Certifier //////
            // Open
            : getExamStage() === ExamStage.Certifier_Open ?
            <StaticExamPage exam={exam} message="This exam is ongoing! The certifier cannot submit." />
            // Under Correction
            : getExamStage() === ExamStage.Certifier_UnderCorrection ?
            <CertifierUnderCorrection id={id} exam={exam} />
            // Cancelled
            : getExamStage() === ExamStage.Certifier_Cancelled ?
            <StaticExamPage exam={exam} message="The exam has been cancelled!" />
            // Corrected
            : getExamStage() === ExamStage.Certifier_Corrected &&
            <CertifierCorrected exam={exam} id={id} />
            }
        </ResponsivePageWrapper>
    )
}

export default ExamPage