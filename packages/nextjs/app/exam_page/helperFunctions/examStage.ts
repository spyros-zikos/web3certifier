import { getLastSubmitterAddressCookieName } from "~~/constants";
import { ExamStage } from "~~/types/ExamStage";
import Cookies from 'js-cookie';

export const examStage = (
    examStatus: string,
    userStatus: string,
    address: any,
    exam: Exam | undefined,
    userCanClaimReward: boolean,
    id: bigint
) => {
    const lastSubmitterAddressCookie = getLastSubmitterAddressCookieName(address, id);
    
    if (address === exam?.certifier) {
        // Open
        if (examStatus === "Open") return ExamStage.Certifier_Open
        // Under Correction
        else if (examStatus === "Under Correction") return ExamStage.Certifier_UnderCorrection
        // Cancelled
        else if (examStatus === "Cancelled") return ExamStage.Certifier_Cancelled;
        // Corrected
        else if (examStatus === "Corrected") return ExamStage.Certifier_Corrected;
    } else {
        // Open
        if (examStatus === "Open") {
            if ((userStatus === "Not Submitted") && !Cookies.get(lastSubmitterAddressCookie)) return ExamStage.User_Open_NotSubmitted;
            else return ExamStage.User_Open_Submitted;
        }
        // Under Correction
        else if (examStatus === "Under Correction") return ExamStage.User_UnderCorrection
        // Cancelled
        else if (examStatus === "Cancelled") {
            if (userStatus === "Submitted" && (exam ? exam.price>0 : 0))
                return ExamStage.User_Cancelled_ClaimRefund;
            return ExamStage.User_Cancelled_NoRefund;
        }
        // Corrected
        else if (examStatus === "Corrected") {
            if (userStatus === "Not Submitted") return ExamStage.User_Corrected_NotSubmitted;
            else {
                if (userStatus === "Succeeded") {
                    if (userCanClaimReward) return ExamStage.User_Corrected_SucceededClaimReward;
                    return ExamStage.User_Corrected_SucceededNoReward;
                }
                if (userStatus === "Failed") return ExamStage.User_Corrected_Failed;
                return ExamStage.User_Corrected_ClaimCertificate;
            }
        }
    }
}