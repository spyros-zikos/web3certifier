
export enum ExamStage {
    // --- Start --- 
    Certifier_Open,
    User_OpenNotSubmitted, // submit
    User_OpenSubmitted,

    // --- Correction period start --- 
    Certifier_Correct, // submit
    User_WaitForCorrection,

    // --- Exam got cancelled --- 
    User_ClaimRefund, // submit
    Certifier_CancelStats,
    User_CancelStats,
    
    // --- Exam Ended ---
    Certifier_EndStats,
    User_ClaimCertificate, // submit
    User_ClaimReward, // submit
    User_EndSuccessStats, // for successful participants
    User_EndFailStats, // for failed participants
    User_Details, // for non-participants
}