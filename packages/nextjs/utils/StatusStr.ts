export function getExamStatusStr(statusNum: number | undefined) {
    if (statusNum === undefined) return "Undefined";
    return statusNum == 0 ? "Open" 
        : statusNum == 1 ? "Under Correction"
        : statusNum == 2 ? "Cancelled"
        : "Corrected";
}

export function getUserStatusStr(statusNum: number | undefined) {
    if (statusNum === undefined) return "Undefined";
    return statusNum == 0 ? "Not Submitted" 
        : statusNum == 1 ? "Submitted"
        : statusNum == 2 ? "Succeeded"
        : statusNum == 3 ? "Failed"
        : "Refunded";
}