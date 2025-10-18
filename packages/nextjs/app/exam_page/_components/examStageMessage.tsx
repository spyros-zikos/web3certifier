/* eslint-disable react/display-name */

import { Box } from "@chakra-ui/react";
import { ExamStage } from "~~/types/ExamStage";
import JoinDiscordMessage from "./JoinDiscordMessage";
import { DEFAULT_USER_ADDRESS } from "~~/constants";
import { VerifyAccountMessage } from "../pages/UserOpenNotSubmitted/components";
import Link from "next/link";

const examStageMessageFunction: any = (examStage: ExamStage) => {
    /// User ///
    // Open
    if (examStage === ExamStage.User_Open_NotSubmitted)
        return (needsVerification: boolean, canClaimEngagementRewards: boolean, address: string, publicClient: any, walletClient: any) => (
            <div>
                {!needsVerification && canClaimEngagementRewards && <><Box color="green">You are eligible to claim engagement rewards (2k G$ tokens) if you submit your answers to this exam!</Box><br /></>}
                {needsVerification && (address !== DEFAULT_USER_ADDRESS) && <VerifyAccountMessage publicClient={publicClient} walletClient={walletClient}/>}
                
                <Box color="lighterLighterBlack">
                    Note: The system uses cookies.
                    This means that you can claim your certificate only from this device.
                </Box>
            </div>
        );
    else if (examStage === ExamStage.User_Open_Submitted)
        return () => (<> <Box display="inline">Your answers are submitted!</Box> <JoinDiscordMessage /> </>);
    // Under Correction
    else if (examStage === ExamStage.User_UnderCorrection)
        return () => "This exam is being corrected by the certifier!";
    // Cancelled
    else if (examStage === ExamStage.User_Cancelled_ClaimRefund)
        return () => "You can claim your refund!";
    else if (examStage === ExamStage.User_Cancelled_NoRefund)
        return () => "The exam has been cancelled!";
    // Corrected
    else if (examStage === ExamStage.User_Corrected_ClaimCertificate)
        return (passwordHashGood: boolean) => (
            passwordHashGood
                ? <Box>Claim your certificate!</Box>
                : <>
                    <Box display="inline">Cookie not found!
                        Please use the browser that you used to submit the exam.
                        If you are still having issues, get support at our </Box>
                    <Box display="inline" textDecoration={"underline"}>
                    <Link href="https://discord.gg/4rXWFNGmDJ">Discord server</Link></Box>.
                </>
        );
    else if (examStage === ExamStage.User_Corrected_SucceededClaimReward)
        return (scaledRewardAmountForUser: bigint, tokenSymbol: string) => "You claim can claim " + scaledRewardAmountForUser + " " + tokenSymbol + "! Claim your reward now!";
    else if (examStage === ExamStage.User_Corrected_SucceededClaimReward_ZeroReward)
        return () => "This exam has ended! You completed it successfully! Unfortunately, you don't qualify for rewards.";
    else if (examStage === ExamStage.User_Corrected_SucceededClaimReward_NotEnoughTokens)
        return () => "This exam has ended! You completed it successfully! Unfortunately, the reward pool does not have enough tokens to reward you.";
    else if (examStage === ExamStage.User_Corrected_SucceededNoReward)
        return () => "This exam has ended! You completed it successfully!";
    else if (examStage === ExamStage.User_Corrected_Failed)
        return (exam: any, userScore: bigint | undefined, questionsAndPossibleAnswers: any) => {
            return (exam 
                ? <div>You failed this exam! Your score was {userScore?.toString()}/{questionsAndPossibleAnswers?.length} {""} but you need at least {exam!.baseScore.toString()}/{questionsAndPossibleAnswers?.length} to pass.</div>
                : <div>Loading...</div>
            )
        };
    else if (examStage === ExamStage.User_Corrected_NotSubmitted)
        return (isConnected: boolean) => (isConnected ? "This exam has ended. You did not participate!" : "Connect your wallet to claim your certificate!");
    /// Certifier ///
    else if (examStage === ExamStage.Certifier_Open)
        return () => "This exam is ongoing! The certifier cannot submit.";
    else if (examStage === ExamStage.Certifier_UnderCorrection)
        return () => "This exam needs correcting. Please provide the correct answers within the correction period of the exam.";
    else if (examStage === ExamStage.Certifier_Cancelled)
        return () => "The exam has been cancelled!";
    else if (examStage === ExamStage.Certifier_Corrected)
        return () => "This exam has ended!";
    return () => "Invalid Stage";
}

export default examStageMessageFunction