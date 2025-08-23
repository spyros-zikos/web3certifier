// Checks if user has alreay claimed by checking the database
import { NextResponse } from "next/server";
import { connectToDatabase } from "~~/services/mongodb";

export async function GET(request: Request) {
    let client;
    try {
        const { db, client: connectedClient } = await connectToDatabase();
        client = connectedClient;

        const url = new URL(request.url);
        const chainId = Number(url.searchParams.get('chainId'));
        const examId = Number(url.searchParams.get('examId'));
        const user = url.searchParams.get('user');

        if (examId === undefined || !chainId || !user) {
            return NextResponse.json({ error: "Invalid request. The 'examId', 'chainId', and 'user' are required." }, { status: 400 });
        }

        // Check if user has already claimed faucet funds
        const claimCertificateFaucet = await db.collection("claim_certificate_faucet").findOne({ chainId, examId, user });

        return new Response(JSON.stringify(claimCertificateFaucet ? true : false), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    }
    catch (error: any) {
        console.error("Failed to create exam:", error);
        return NextResponse.json({ message: error.message || "Internal Server Error" }, { status: 500 });
    }
}
