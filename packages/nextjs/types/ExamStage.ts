
export enum ExamStage {
    // --- Start --- 
    Certifier_Open,
    User_Open_NotSubmitted, // submit
    User_Open_Submitted,

    // --- Correction period start --- 
    Certifier_UnderCorrection, // submit
    User_UnderCorrection,

    // --- Exam got cancelled --- 
    Certifier_Cancelled,
    User_Cancelled_ClaimRefund, // submit
    User_Cancelled_NoRefund,
    
    // --- Exam Ended ---
    Certifier_Corrected,
    User_Corrected_ClaimCertificate, // submit
    User_Corrected_SucceededClaimReward, // submit
    User_Corrected_SucceededNoReward, // for successful participants
    User_Corrected_Failed, // for failed participants
    User_Corrected_NotSubmitted, // for non-participants
}