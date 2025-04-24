// Certifier stats after exam correction
// 1. Number of submissions
// 2. Number of correct submissions
// 3. Profit
const getCertifierStatsAfterCorrection = async (exam: Exam) => {
    let numOfSubmissions = exam.users.length;
    let numOfCorrectSubmissions = exam.tokenIds.length;
    let revenue = numOfSubmissions * Math.round(Number(exam.price) / 1e16) / 1e2;

    const statsText = `============== Statistics ==============\n\n`+
    `Number of submissions: ${numOfSubmissions}\n\n`+
    `Number of correct submissions: ${numOfCorrectSubmissions}\n\n`+
    `Revenue (pre fee): $${revenue}\n\n`+
    `===================================\n`;
    
    return statsText;
}

export default getCertifierStatsAfterCorrection