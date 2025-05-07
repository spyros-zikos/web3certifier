import { ExamStage } from "~~/types/ExamStage";

export const examStage = (
    examStatus: string,
    userStatus: string,
    address: any,
    exam: Exam | undefined,
) => {
    if (address === exam?.certifier) {
        if (examStatus === "Open") return ExamStage.Certifier_Open
        else if (examStatus === "Under Correction") return ExamStage.Certifier_Correct
        else if (examStatus === "Cancelled") return ExamStage.Both_CancelStats;
        else if (examStatus === "Corrected") return ExamStage.Certifier_EndStats;
    } else {
        if (examStatus === "Open") {
            if (userStatus === "Not Submitted") return ExamStage.User_OpenNotSubmitted;
            else return ExamStage.User_OpenSubmitted;
        }
        else if (examStatus === "Under Correction") return ExamStage.User_WaitForCorrection
        else if (examStatus === "Cancelled") {
            if (userStatus === "Submitted" && (exam ? exam.price>0 : 0))
                return ExamStage.User_ClaimRefund;
            return ExamStage.Both_CancelStats;
        }
        else if (examStatus === "Corrected") {
            if (userStatus === "Not Submitted") return ExamStage.User_Details;
            else {
                if (userStatus === "Succeeded") return ExamStage.User_EndSuccessStats;
                if (userStatus === "Failed") return ExamStage.User_EndFailStats;
                return ExamStage.User_ClaimCertificate;
            }
        }
    }
}