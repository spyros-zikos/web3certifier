import { getScoresOfUsersWithStatus } from "./getAvgScoreOfUsersWithStatus";

export enum ScoreType {
    Success,
    Fail,
    All
}

export async function getAvgScores(request: Request, scoreType: ScoreType) {
    try {
        const url = new URL(request.url);
        const chainId = Number(url.searchParams.get('chainId'));
        const examId = Number(url.searchParams.get('examId'));
        if (isNaN(chainId) || isNaN(examId)) {
            return new Response('Invalid chainId or examId', { status: 400 });
        }
        
        const userStatusFunction = (scoreType == ScoreType.Success) ? ((status: any) => status == 2):
            (scoreType == ScoreType.Fail) ? ((status: any) => status == 3):
            ((status: any) => status >= 2);
        const score = await getScoresOfUsersWithStatus(chainId, examId, userStatusFunction);

        return new Response(JSON.stringify(score), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error('API Error:', error);
        
        return new Response(
            JSON.stringify({ 
                error: 'Internal server error',
                message: error instanceof Error ? error.message : 'Unknown error'
            }), 
            { 
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            }
        );
    }
}