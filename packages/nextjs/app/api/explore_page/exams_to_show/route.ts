// export async function GET(request: Request) {
//     try {
//         const url = new URL(request.url);
//         const chainId = Number(url.searchParams.get('chainId'));
//         const examId = Number(url.searchParams.get('examId'));
//         if (isNaN(chainId) || isNaN(examId)) {
//             return new Response('Invalid chainId or examId', { status: 400 });
//         }

//         const avgScore = await getScoresOfUsersWithStatus(chainId, examId, (status: any) => status >= 2);

//         return new Response(JSON.stringify(avgScore), {
//             status: 200,
//             headers: { 'Content-Type': 'application/json' }
//         });
//     } catch (error) {
//         console.error('API Error:', error);
        
//         return new Response(
//             JSON.stringify({ 
//                 error: 'Internal server error',
//                 message: error instanceof Error ? error.message : 'Unknown error'
//             }), 
//             { 
//                 status: 500,
//                 headers: { 'Content-Type': 'application/json' }
//             }
//         );
//     }
// }
