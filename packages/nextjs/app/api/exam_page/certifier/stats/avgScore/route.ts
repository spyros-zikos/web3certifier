import { getAvgScores, ScoreType } from "../getAvgScores";

export async function GET(request: Request) {
    return await getAvgScores(request, ScoreType.All);
}
