import { gql, request } from 'graphql-request';

type ScoreType = "All" | "Pass" | "Fail";

function getQuery(scoreType: ScoreType, examId: bigint) {
    if (scoreType == "All") {
        return gql`{
            claimNFTs(where: {
                examId: "${examId}"
            }) {
                answers
            }
            userFaileds(where: {
            examId: "${examId}"
            }) {
                answers
            }
        }`;
    } else if (scoreType == "Pass") {
        return gql`{
            claimNFTs(where: {
                examId: "${examId}"
            }) {
                answers
            }
        }`;
    } else {
        return gql`{
            userFaileds(where: {
                examId: "${examId}"
            }) {
                answers
            }
        }`;
    }
}

function getScore(answers: string, correctAnswers: string): number {
    if (answers.length != correctAnswers.length)
        return -1;
    let score = 0;
    for (let i = 0; i < answers.length; i++)
        if (answers[i] == correctAnswers[i])
            score++;
    return score;
}

// GRAPH QUERIES
export async function getAvgScore(scoreType: ScoreType, examId: bigint, correctAnswers: string) {
    // Get open certificate names and ids
    const query = getQuery(scoreType, examId);
    const response: any = await request(process.env.NEXT_PUBLIC_THE_GRAPH_URL!, query);
    const data = await response;
    const answersList = scoreType == "All" ? data.claimNFTs.concat(data.userFaileds) : scoreType == "Pass" ? data.claimNFTs : data.userFaileds;
    const answers = answersList.map((examObject: any) => `${examObject["answers"]}`);
    const avgScore = answers.map((answer: string) => getScore(answer, correctAnswers)).reduce((a: number, b: number) => a + b, 0) / answers.length;
    return avgScore.toFixed(2);
}