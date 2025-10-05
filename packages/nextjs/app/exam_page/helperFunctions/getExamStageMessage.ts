import { ExamStage } from "~~/types/ExamStage";

const getExamStageMessage = (examStage: ExamStage) => {
    if (examStage === ExamStage.User_Open_NotSubmitted)
        return "";
    else if (examStage === ExamStage.User_Open_Submitted)
        return "";
    else if (examStage === ExamStage.User_UnderCorrection)
        return "";
    else if (examStage === ExamStage.User_Cancelled_ClaimRefund)
        return "";
    else if (examStage === ExamStage.User_Cancelled_NoRefund)
        return "";
    else if (examStage === ExamStage.User_Corrected_ClaimCertificate)
        return "";
    else if (examStage === ExamStage.User_Corrected_SucceededClaimReward)
        return "";
    else if (examStage === ExamStage.User_Corrected_SucceededClaimReward_ZeroReward)
        return "";
    else if (examStage === ExamStage.User_Corrected_SucceededClaimReward_NotEnoughTokens)
        return "";
    else if (examStage === ExamStage.User_Corrected_SucceededNoReward)
        return "";
    else if (examStage === ExamStage.User_Corrected_Failed)
        return "";
    else if (examStage === ExamStage.User_Corrected_NotSubmitted)
        return "";
    else if (examStage === ExamStage.Certifier_Open)
        return "";
    else if (examStage === ExamStage.Certifier_UnderCorrection)
        return "";
    else if (examStage === ExamStage.Certifier_Cancelled)
        return "";
    else if (examStage === ExamStage.Certifier_Corrected)
        return "";
}

export default getExamStageMessage