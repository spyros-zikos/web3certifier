import { connectToDatabase } from "~~/services/mongodb";

export async function GET(request: Request) {
    try {
        const url = new URL(request.url);
        const chainId = Number(url.searchParams.get('chainId'));

        if (isNaN(chainId)) {
            return new Response('Invalid chainId', { status: 400 });
        }

        const { db } = await connectToDatabase();
        const collectionName = "exams_to_show";
        const examIdsRecord = await db.collection(collectionName).findOne({ chainId });
        const examIds = examIdsRecord ? examIdsRecord.examIds : [];

        return new Response(JSON.stringify(examIds), {
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
