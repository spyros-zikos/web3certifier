import { ExamStage } from "~~/types/ExamStage";

export const examStage = (
    examStatus: string,
    userStatus: string,
    address: any,
    exam: Exam | undefined,
    userCanClaimReward: boolean
) => {
    if (address === exam?.certifier) {
        // Open
        if (examStatus === "Open") return ExamStage.Certifier_Open
        // Under Correction
        else if (examStatus === "Under Correction") return ExamStage.Certifier_Correct
        // Cancelled
        else if (examStatus === "Cancelled") return ExamStage.Certifier_CancelStats;
        // Corrected
        else if (examStatus === "Corrected") return ExamStage.Certifier_EndStats;
    } else {
        // Open
        if (examStatus === "Open") {
            if (userStatus === "Not Submitted") return ExamStage.User_OpenNotSubmitted;
            else return ExamStage.User_OpenSubmitted;
        }
        // Under Correction
        else if (examStatus === "Under Correction") return ExamStage.User_WaitForCorrection
        // Cancelled
        else if (examStatus === "Cancelled") {
            if (userStatus === "Submitted" && (exam ? exam.price>0 : 0))
                return ExamStage.User_ClaimRefund;
            return ExamStage.User_CancelStats;
        }
        // Corrected
        else if (examStatus === "Corrected") {
            if (userStatus === "Not Submitted") return ExamStage.User_Details;
            else {
                if (userStatus === "Succeeded") {
                    if (userCanClaimReward) return ExamStage.User_ClaimReward;
                    return ExamStage.User_EndSuccessStats;
                }
                if (userStatus === "Failed") return ExamStage.User_EndFailStats;
                return ExamStage.User_ClaimCertificate;
            }
        }
    }
}