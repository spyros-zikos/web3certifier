import { ExamStage } from "~~/types/ExamStage";

export const examStage = (
    status: string,
    userHasNotParticipated: boolean, 
    address: any,
    exam: Exam | undefined,
    userHasClaimed: boolean | undefined
) => {
    if (address === exam?.certifier) {
        if (status === "Started") return ExamStage.Certifier_Started
        else if (status === "Needs Correction") return ExamStage.Certifier_Correct
        else if (status === "Cancelled") return ExamStage.Both_CancelStats;
        else if (status === "Ended") return ExamStage.Certifier_EndStats;
    } else {
        if (status === "Started") {
            if (userHasNotParticipated) return ExamStage.User_StartedNotSubmitted;
            else return ExamStage.User_StartedSubmitted;
        }
        else if (status === "Needs Correction") return ExamStage.User_WaitForCorrection
        else if (status === "Cancelled") {
            if (!userHasClaimed && !userHasNotParticipated && (exam ? exam.price>0 : 0))
                return ExamStage.User_ClaimRefund;
            return ExamStage.Both_CancelStats;
        }
        else if (status === "Ended") {
            if (userHasNotParticipated) return ExamStage.User_Details;
            else {
                if (userHasClaimed) return ExamStage.User_EndStats;
                return ExamStage.User_ClaimCertificate;
            }
        }
    }
}