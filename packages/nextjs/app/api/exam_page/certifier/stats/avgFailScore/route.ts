import { wagmiReadFromContractAsync } from "~~/utils/wagmi/wagmiReadAsync";
import { getScoresOfUsersWithStatus } from "../getAvgScoreOfUsersWithStatus";

export async function GET(request: Request) {
    try {
        const url = new URL(request.url);
        const chainId = Number(url.searchParams.get('chainId'));
        const examId = Number(url.searchParams.get('examId'));
        if (isNaN(chainId) || isNaN(examId)) {
            return new Response('Invalid chainId or examId', { status: 400 });
        }
        
        const avgFailScore = await getScoresOfUsersWithStatus(chainId, examId, (status: any) => status == 3);

        return new Response(JSON.stringify(avgFailScore), {
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
